import ServiceCallerError from '../error/service-caller-error';

export type Config = {
    logLevel: LogLevel,
    outageServiceUrl: string,
    outageServiceApiKey: string,
}

export type LogLevel = 
| 'debug'
| 'info'
| 'warn'
| 'error'

export type Outage = {
    id: string,
    begin: Date,
    end: Date,
}

export type Device = {
    id: string,
    name: string,
}

export type SiteInfo = {
    id: string,
    name: string,
    devices: Device[],
}

export type EnhancedOutage = {
    id: string,
    name: string,
    begin: Date,
    end: Date,
}

export type ServiceCallerRequest = {
    url: string,
    method: string,
    data?: any,
    headers?: { [key: string]: any},
    timeout?: number,
}

export type ServiceCallerResponse = {
    data?: any,
    error?: ServiceCallerError,
}