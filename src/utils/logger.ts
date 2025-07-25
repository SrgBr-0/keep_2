export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}

class Logger {
    private level: LogLevel;

    constructor() {
        this.level = process.env.LOG_LEVEL ?
            parseInt(process.env.LOG_LEVEL) : LogLevel.INFO;
    }

    private log(level: LogLevel, message: string, data?: any) {
        if (level <= this.level) {
            const timestamp = new Date().toISOString();
            const levelName = LogLevel[level];

            console.log(`[${timestamp}] ${levelName}: ${message}`,
                data ? JSON.stringify(data, null, 2) : '');
        }
    }

    error(message: string, data?: any) {
        this.log(LogLevel.ERROR, message, data);
    }

    warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    debug(message: string, data?: any) {
        this.log(LogLevel.DEBUG, message, data);
    }
}

export const logger = new Logger();