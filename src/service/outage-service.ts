import OutageServiceCaller from "../service-caller/outage-service-caller";
import { 
    Outage,
    SiteInfo,
    EnhancedOutage,
} from "../types";

export default interface OutageService {
    getAllOutages(): Promise<Outage[]>;
    getSiteInfo(siteId: string): Promise<SiteInfo>;
    reportSiteOutage(siteId: string, enhancedOutages: EnhancedOutage[]): Promise<void>;
}

export class DefaultOutageService implements OutageService {
    protected outageServiceCaller: OutageServiceCaller;

    public constructor(outageServiceCaller: OutageServiceCaller) {
        this.outageServiceCaller = outageServiceCaller;
    }

    async getAllOutages() {
        return this.outageServiceCaller.getAllOutages();
    }

    async getSiteInfo(siteId: string): Promise<SiteInfo> {
        return this.outageServiceCaller.getSiteInfo(siteId);
    }

    async reportSiteOutage(siteId: string, enhancedOutages: EnhancedOutage[]) {
        return this.outageServiceCaller.reportSiteOutage(siteId, enhancedOutages);
    }
}