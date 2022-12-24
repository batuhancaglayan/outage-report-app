import { LogLevel } from '../types';
import { LOG_LEVEL } from '../constants';

const logger = require('npmlog');

logger.addLevel('debug', 1600, { fg: 'green' });
logger.level = process.env[LOG_LEVEL] ?
    process.env[LOG_LEVEL].toLowerCase() : 'debug';
logger.disableColor();

export default {
    getLogLevel: (): LogLevel => {
        return logger.level;
    },
    setLogLevel: (logLevel: LogLevel) => {
        logger.level = logLevel;
    },
    canLog: (logLevel: LogLevel): boolean => {
        if (!logger.levels || !logger.level) {
            return false;
        }

        const logLevelNumber = logger.levels[logLevel];
        const currentLogLevelNumber = logger.levels[logger.level];
        if (!logLevelNumber || !currentLogLevelNumber) {
            return false;
        }

        return currentLogLevelNumber >= logLevelNumber;
    },
    info: (message: string): void => {
        logger.info('', message);
    }, 
    warn:(message: string): void => {
        logger.warn('', message);
    }, 
    debug: (message: string): void => {
        logger.debug('', message);
    },
    error: (message: string, err?: Error): void => {
        if (err) {
            logger.error('', message, err);
        } else {
            logger.error('', message);
        }
    }
};