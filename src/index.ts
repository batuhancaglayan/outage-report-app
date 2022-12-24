import OutageManager, { DefaultOutageManager } from './manager/outage-manager';
import { DefaultOutageService } from './service/outage-service';
import { DefaultOutageServiceCaller } from './service-caller/outage-service-caller';
import Logger from './logger';

/**
 * Trigger source of identify and report outage code.
 * For production scenario, trigger source could be a scheduler, a queue, a http call etc..
 * siteName and outageBegin hardcoded in here, for real life scenario it could be passed by trigger source.
 */

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