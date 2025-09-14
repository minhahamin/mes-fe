import { env } from './env';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Logger class
class Logger {
  private logLevel: LogLevel;
  private isDebugMode: boolean;

  constructor() {
    this.isDebugMode = env.isDebugMode();
    this.logLevel = this.getLogLevel();
  }

  private getLogLevel(): LogLevel {
    const level = env.get('LOG_LEVEL');
    switch (level) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    return `${prefix} ${message}`;
  }

  private log(level: LogLevel, levelName: string, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        break;
    }

    // Send to external logging service in production
    if (env.isProduction() && level >= LogLevel.ERROR) {
      this.sendToExternalLogger(levelName, message, args);
    }
  }

  private sendToExternalLogger(level: string, message: string, args: any[]): void {
    // Send to Sentry or other logging service
    const sentryDsn = env.get('SENTRY_DSN');
    if (sentryDsn) {
      // Implement Sentry logging here
      console.log('Sending to external logger:', { level, message, args });
    }
  }

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, 'INFO', message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, 'WARN', message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, 'ERROR', message, ...args);
  }

  // MES specific logging methods
  public logProduction(action: string, data: any): void {
    this.info(`[PRODUCTION] ${action}`, data);
  }

  public logQuality(action: string, data: any): void {
    this.info(`[QUALITY] ${action}`, data);
  }

  public logInventory(action: string, data: any): void {
    this.info(`[INVENTORY] ${action}`, data);
  }

  public logEquipment(action: string, data: any): void {
    this.info(`[EQUIPMENT] ${action}`, data);
  }

  public logApiCall(method: string, url: string, status: number, duration: number): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, 'API', `${method} ${url} - ${status} (${duration}ms)`);
  }

  public logUserAction(userId: string, action: string, data: any): void {
    this.info(`[USER:${userId}] ${action}`, data);
  }

  public logSystemEvent(event: string, data: any): void {
    this.info(`[SYSTEM] ${event}`, data);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const {
  debug,
  info,
  warn,
  error,
  logProduction,
  logQuality,
  logInventory,
  logEquipment,
  logApiCall,
  logUserAction,
  logSystemEvent,
} = logger;

export default logger;
