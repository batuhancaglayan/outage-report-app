import { Config } from "../types";
import {
    LOG_LEVEL,
    OUTAGE_SERVICE_API_KEY,
    OUTAGE_SERVICE_URL,
} from "../constants";

const AppConfig = {
    logLevel: process.env[LOG_LEVEL] || 'error',
    outageServiceUrl: process.env[OUTAGE_SERVICE_URL],
    outageServiceApiKey: process.env[OUTAGE_SERVICE_API_KEY],
} as Config;

export default AppConfig;