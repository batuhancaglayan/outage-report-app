import sinon from 'sinon';
import chai from 'chai';

import OutageService, { DefaultOutageService } from '../../src/service/outage-service';
import { DefaultOutageServiceCaller } from '../../src/service-caller/outage-service-caller';

import MockData from '../data/mock-data';
import mockData from '../data/mock-data';
import ServiceCaller from '../../src/service-caller';
import ServiceCallerError from '../../src/error/service-caller-error';
import * as Contants from '../../src/constants';

describe('Outage Service Unit Test', () => {

    const siteName = 'kingfisher';

    let outageService: OutageService;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.createSandbox();

        outageService = new DefaultOutageService(new DefaultOutageServiceCaller());
    })

    beforeEach(() => {
        sandbox.restore();
    })
    
    after(() => {
        sandbox.restore();
    })

    it('Verify Get Outages', async () => {
        const stub = sandbox.stub(DefaultOutageServiceCaller.prototype, 'getAllOutages').callsFake(async () => MockData.outages);
        const outages = await outageService.getAllOutages();
        chai.expect(stub.calledOnce).equals(true);
        chai.expect(JSON.stringify(outages)).equals(JSON.stringify(MockData.outages));
    })

    it('Verify Error on Get Outages', async () => {
        sandbox.stub(ServiceCaller, 'request')
        .callsFake(async () => { throw new ServiceCallerError('test 401', 401) });
        await outageService.getAllOutages().catch(err => {
            chai.expect(err.status).equals(401);
        });
    })

    it('Verify Get Site Info', async () => {
        const stub = sandbox.stub(DefaultOutageServiceCaller.prototype, 'getSiteInfo').callsFake(async () => MockData.siteInfo);
        const siteInfo = await outageService.getSiteInfo(siteName);
        chai.expect(stub.withArgs(siteName).calledOnce).equals(true);
        chai.expect(JSON.stringify(siteInfo)).equals(JSON.stringify(MockData.siteInfo));
    })

    it('Verify Error on Get Site Info', async () => {
        sandbox.stub(ServiceCaller, 'request')
        .callsFake(async () => { throw new ServiceCallerError('test 401', 401) });
        await outageService.getSiteInfo(siteName).catch(err => {
            chai.expect(err.status).equals(401);
        });
    })

    it('Verify Report Site Outage', async () => {
        const stub = sandbox.stub(DefaultOutageServiceCaller.prototype, 'reportSiteOutage').callsFake(async () => {});
        await outageService.reportSiteOutage(siteName, mockData.siteOutages as any);
        chai.expect(stub.calledOnce).equals(true);
    })

    it('Verify Report Site Outage Retry Count', async () => {
        sandbox.replace(Contants, 'RETRY_DELAY', 1000);
        const stub = sandbox.stub(ServiceCaller, 'request').callsFake(async () => { throw new ServiceCallerError('test 500', 500)})
        await outageService.reportSiteOutage(siteName, mockData.siteOutages as any).catch(err => {
            chai.expect(stub.calledThrice).equals(true);
        });
      
    }).timeout(4 * 1000)

    it('Verify Report Site Outage Success after Retry', async () => {
        let count = 0;
        sandbox.replace(Contants, 'RETRY_DELAY', 1000);
        const stub = sandbox.stub(ServiceCaller, 'request').callsFake(async () => {
            if (count >= 1) {
                return {};
            }

            count += 1;
            throw new ServiceCallerError('test 500', 500)
        });

        await outageService.reportSiteOutage(siteName, mockData.siteOutages as any).then(data => {
            chai.expect(stub.calledTwice).equals(true);
        });
      
    }).timeout(4 * 1000)
});