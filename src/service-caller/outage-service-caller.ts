import { 
    SiteInfo,
    Outage,
} from "../types";
import AppConfig from "../config";
import ServiceCaller from ".";
import * as Path from 'path';
import {
    RETRY_COUNT,
    RETRY_DELAY,
} from '../constants';
import Logger from '../logger';

const headers = {
    'x-api-key': AppConfig.outageServiceApiKey
}

const outageServiceEndpoints = {
    getOutages: Path.join(AppConfig.outageServiceUrl, '/outages'),
    getSiteInfo: Path.join(AppConfig.outageServiceUrl, '/site-info/{siteId}'),
    addSiteOutage: Path.join(AppConfig.outageServiceUrl, '/site-outages/{siteId}')
}

export default interface OutageServiceCaller {
    getAllOutages(): Promise<Outage[]>;
    getSiteInfo(siteId: string): Promise<SiteInfo>;
    reportSiteOutage(siteId: string, outages: Outage[]): Promise<void>;
}

export class DefaultOutageServiceCaller implements OutageServiceCaller {
    async getAllOutages() {
        const response = await ServiceCaller.request({ 
            url: outageServiceEndpoints.getOutages,
            method: 'GET',
            headers,
        });

        return (response && response.data) || [];
    }

    async getSiteInfo(siteId: string) {
        const response = await ServiceCaller.request({ 
            url: outageServiceEndpoints.getSiteInfo.replace('{siteId}', siteId),
            method: 'GET',
            headers,
        });

        return response && response.data;
    }

    async reportSiteOutage(siteId: string, outages: Outage[]) {
        const makeRequest = () => {
            return ServiceCaller.request({ 
                url: outageServiceEndpoints.addSiteOutage.replace('{siteId}', siteId),
                method: 'POST',
                data: outages,
                headers,
            });
        }

        let retry = 0;
        return new Promise<void>((resolve, reject) => {
            const request = () => {
                makeRequest()
                .then(response => resolve())
                .catch(err => {
                    if (retry >= RETRY_COUNT) {
                        reject(err);
                        return;
                    }

                    setTimeout(() => {
                        retry += 1;
                        request();
                    }, RETRY_DELAY);
                })
            };
            
            request();
        })
    }
}