import ApplicationBaseException from "./application-base-exception";

export default class ServiceCallerError extends ApplicationBaseException {
    public status?: number;

    public constructor(message: string, status?: number) {
        super(message);
        
        this.status = status;
    }
}