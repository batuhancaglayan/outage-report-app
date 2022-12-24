import { MAX_ARRAY_PROCESS_SIZE } from "../constants";
import OutageService from "../service/outage-service";
import { 
    Outage,
    EnhancedOutage,
    Device,
} from "../types";
import { 
    breathSpace,
    arrayToMap,
} from '../utils';
import Logger from "../logger";

export default interface OutageManager {
    identifyAndReportOutage(siteName: string, beganDate: Date): Promise<void>;
}

export class DefaultOutageManager implements OutageManager{
    private outageService: OutageService;
    
    public constructor(outageService: OutageService) {
        this.outageService = outageService;
    }

    async identifyAndReportOutage(siteName: string, beganDate: Date): Promise<void> {
        const [
            outages,
            siteInfo,
        ] = await Promise.all([
            this.outageService.getAllOutages(),
            this.outageService.getSiteInfo(siteName)]);

        if (!outages) {
            Logger.info('<DefaultOutageManager> There are no received outages.');
            return;
        }

        if (!siteInfo) {
            Logger.info(`<DefaultOutageManager> There is no received site info for: ${siteName}`);
            return;
        }

        const siteDeviceInfo: { [key: string]: Device } = arrayToMap(siteInfo.devices, 'id');

        const enhancedOutages: EnhancedOutage[] = await this.identifyOutages(outages, siteDeviceInfo, beganDate);
        if (Logger.canLog('debug')) {
            Logger.debug(`<DefaultOutageManager> EnhancedOutages: ${JSON.stringify(enhancedOutages)}`);
        }

        await this.reportOutages(siteInfo.id, enhancedOutages);
    }

    private async identifyOutages(outages: Outage[], siteDeviceInfo: { [key: string]: Device }, beganDate: Date) {
        const enhancedOutages: EnhancedOutage[] = [];
        for (let i = 0; i < outages.length; i++) {
            const outage = outages[i];
            const knownDevice = siteDeviceInfo[outage.id];
            const outageBeginTime = new Date(outage.begin).getTime();
            if (knownDevice && outageBeginTime >= beganDate.getTime()) {
                enhancedOutages.push({
                    id: outage.id,
                    name: knownDevice.name,
                    begin: outage.begin,
                    end: outage.end,
                })
            }

            /**
             * Not actually needed for this small project.
             * If more than MAX_ARRAY_PROCESS_SIZE item processing,
             * put a small breath task for do not block event loop.
             */
            if (i % MAX_ARRAY_PROCESS_SIZE == 0) {
                Logger.debug(`<DefaultOutageManager> BreathSpace will occered for long running loop.`)
                await breathSpace(0);
            }
        }

        return enhancedOutages;
    }

    private async reportOutages(siteId: string, enhancedOutages: EnhancedOutage[]) {
        return this.outageService.reportSiteOutage(siteId, enhancedOutages);
    }
}