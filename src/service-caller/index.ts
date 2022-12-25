import axios from 'axios';
import ServiceCallerError from '../error/service-caller-error';
import { 
  ServiceCallerRequest,
  ServiceCallerResponse,
} from '../types';
import Logger from '../logger';

export default class ServiceCaller {
    private constructor() {
    }

    static async request(request: ServiceCallerRequest): Promise<ServiceCallerResponse> {
      Logger.debug(`<ServiceCaller> Request: ${request.method} will be sended to endpoint: ${request.url}.`);
      if (Logger.canLog('debug') && request.data) {
        Logger.debug(`<ServiceCaller> Body will attached to request: ${JSON.stringify(request.data)}`);
      }

      return axios({
        method: request.method,
        url: request.url,
        data: request.data,
        headers: request.headers,
        timeout: request.timeout || 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        validateStatus: () => true,
      }).then((response) => {
        Logger.debug(`<ServiceCaller> Request: ${request.method} to endpoint: ${request.url} responsed: ${response.status}.`);
        if (response.status === 200) {
          if (Logger.canLog('debug') && response.data) {
            Logger.debug(`<ServiceCaller> Response payload: ${JSON.stringify(response.data)}`);
          }

          return {
            data: response.data,
          } as ServiceCallerResponse;
        }
  
        throw new ServiceCallerError(response.statusText, response.status);
      }).catch((requestError) => {
        Logger.error('<ServiceCaller> An error occured while calling service.', requestError);
        throw new ServiceCallerError(requestError.message);
      });
    }
}
