import OutageManager, { DefaultOutageManager } from './manager/outage-manager';
import { DefaultOutageService } from './service/outage-service';
import { DefaultOutageServiceCaller } from './service-caller/outage-service-caller';
import Logger from './logger';

const siteName = 'norwich-pear-tree';
const outageBegin = new Date('2022-01-01T00:00:00.000Z');

(async() => {
    Logger.info(`<OutageIdentifier> Outages which occured after ${outageBegin} will be processed for site: ${siteName}`);

    const outageManager: OutageManager = new DefaultOutageManager(
        new DefaultOutageService(new DefaultOutageServiceCaller()));
    await outageManager.identifyAndReportOutage(siteName, outageBegin);

    Logger.info(`<OutageIdentifier> Outages reported successfully.`);
})()
.catch(err => Logger.error('<OutageIdentifier> An error occured while processing outages.', err));