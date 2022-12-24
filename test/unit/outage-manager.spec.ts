import sinon from 'sinon';
import chai from 'chai';

import OutageManager, { DefaultOutageManager } from '../../src/manager/outage-manager';
import { DefaultOutageService } from '../../src/service/outage-service';
import { DefaultOutageServiceCaller } from '../../src/service-caller/outage-service-caller';

import MockData from '../data/mock-data';
import { Outage } from '../../src/types';
import { arrayToMap } from '../../src/utils';

describe('Outage Manager Unit Test', () => {

    const siteName = 'kingfisher';
    const outageBegin = new Date('2022-01-01T00:00:00.000Z');

    let outageManager: OutageManager;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();

        outageManager = new DefaultOutageManager(new DefaultOutageService(new DefaultOutageServiceCaller()));
    })

    afterEach(() => {
        sandbox.restore();
    })

    after(() => {
        sandbox.restore();
    })

    it('Verify Identified Outages', async () => {
        sandbox.stub(DefaultOutageServiceCaller.prototype, 'getAllOutages').callsFake(async () => MockData.outages);
        sandbox.stub(DefaultOutageServiceCaller.prototype, 'getSiteInfo').callsFake(async () => MockData.siteInfo);
        sandbox.stub(DefaultOutageServiceCaller.prototype, 'reportSiteOutage').callsFake(async () => {});

        const spy = sandbox.spy(outageManager, <any>'identifyOutages');
        const outages = MockData.outages;
        const devices = MockData.siteInfo.devices;
        const identifiedOutages = await outageManager['identifyOutages'](outages, arrayToMap(devices, 'id'), outageBegin);
        chai.expect(spy.calledOnce).equals(true);
        chai.expect(JSON.stringify(identifiedOutages)).equals(JSON.stringify(MockData.siteOutages));
    })

    it('Verify Identified & Reported Outages', async () => {
        sandbox.restore();
        sandbox.stub(DefaultOutageServiceCaller.prototype, 'getAllOutages').callsFake(async () => MockData.outages);
        sandbox.stub(DefaultOutageServiceCaller.prototype, 'getSiteInfo')
        .callsFake(async (siteId: string) => {
            chai.expect(siteId).equals(siteName)
            return MockData.siteInfo;
        });

        sandbox.stub(DefaultOutageServiceCaller.prototype, 'reportSiteOutage')
        .callsFake(async (siteId: string, outages: Outage[]) => {
            chai.expect(siteId).equals(siteName);
            chai.expect(outages.length).equals(MockData.siteOutages.length);
            chai.expect(JSON.stringify(outages)).equals(JSON.stringify(MockData.siteOutages));
        });

        await outageManager.identifyAndReportOutage(siteName, outageBegin);
    })
});