import { EnvConfig, ENV_KEYS } from '../types/env';

// Environment configuration utility
class EnvManager {
  private config: EnvConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    this.config = {
      // Application
      APP_NAME: this.getEnvVar(ENV_KEYS.APP_NAME, 'MES-FE'),
      APP_VERSION: this.getEnvVar(ENV_KEYS.APP_VERSION, '1.0.0'),
      APP_DESCRIPTION: this.getEnvVar(ENV_KEYS.APP_DESCRIPTION, 'Manufacturing Execution System Frontend'),
      
      // API Configuration
      API_BASE_URL: this.getEnvVar(ENV_KEYS.API_BASE_URL, 'http://localhost:3000/api'),
      API_TIMEOUT: this.getEnvVar(ENV_KEYS.API_TIMEOUT, 10000, 'number'),
      API_RETRY_ATTEMPTS: this.getEnvVar(ENV_KEYS.API_RETRY_ATTEMPTS, 3, 'number'),
      
      // Authentication
      AUTH_TOKEN_KEY: this.getEnvVar(ENV_KEYS.AUTH_TOKEN_KEY, 'mes_auth_token'),
      AUTH_REFRESH_TOKEN_KEY: this.getEnvVar(ENV_KEYS.AUTH_REFRESH_TOKEN_KEY, 'mes_refresh_token'),
      AUTH_TOKEN_EXPIRY: this.getEnvVar(ENV_KEYS.AUTH_TOKEN_EXPIRY, 3600, 'number'),
      
      // Feature Flags
      ENABLE_DEBUG_MODE: this.getEnvVar(ENV_KEYS.ENABLE_DEBUG_MODE, false, 'boolean'),
      ENABLE_ANALYTICS: this.getEnvVar(ENV_KEYS.ENABLE_ANALYTICS, false, 'boolean'),
      ENABLE_MAINTENANCE_MODE: this.getEnvVar(ENV_KEYS.ENABLE_MAINTENANCE_MODE, false, 'boolean'),
      
      // External Services
      WEBSOCKET_URL: this.getEnvVar(ENV_KEYS.WEBSOCKET_URL, 'ws://localhost:3000/ws'),
      FILE_UPLOAD_URL: this.getEnvVar(ENV_KEYS.FILE_UPLOAD_URL, 'http://localhost:3000/api/upload'),
      REPORT_GENERATION_URL: this.getEnvVar(ENV_KEYS.REPORT_GENERATION_URL, 'http://localhost:3000/api/reports'),
      
      // Database
      DB_NAME: this.getEnvVar(ENV_KEYS.DB_NAME, 'mes_cache'),
      DB_VERSION: this.getEnvVar(ENV_KEYS.DB_VERSION, 1, 'number'),
      CACHE_EXPIRY: this.getEnvVar(ENV_KEYS.CACHE_EXPIRY, 86400, 'number'),
      
      // UI Configuration
      THEME: this.getEnvVar(ENV_KEYS.THEME, 'light', 'theme'),
      LANGUAGE: this.getEnvVar(ENV_KEYS.LANGUAGE, 'ko'),
      TIMEZONE: this.getEnvVar(ENV_KEYS.TIMEZONE, 'Asia/Seoul'),
      DATE_FORMAT: this.getEnvVar(ENV_KEYS.DATE_FORMAT, 'YYYY-MM-DD'),
      TIME_FORMAT: this.getEnvVar(ENV_KEYS.TIME_FORMAT, 'HH:mm:ss'),
      
      // Production Settings
      ENVIRONMENT: this.getEnvVar(ENV_KEYS.ENVIRONMENT, 'development', 'environment'),
      LOG_LEVEL: this.getEnvVar(ENV_KEYS.LOG_LEVEL, 'debug', 'logLevel'),
      SENTRY_DSN: this.getEnvVar(ENV_KEYS.SENTRY_DSN, undefined),
      GOOGLE_ANALYTICS_ID: this.getEnvVar(ENV_KEYS.GOOGLE_ANALYTICS_ID, undefined),
      
      // MES Specific
      MES_COMPANY_NAME: this.getEnvVar(ENV_KEYS.MES_COMPANY_NAME, 'Your Company'),
      MES_FACILITY_ID: this.getEnvVar(ENV_KEYS.MES_FACILITY_ID, 'FAC001'),
      MES_SHIFT_DURATION: this.getEnvVar(ENV_KEYS.MES_SHIFT_DURATION, 8, 'number'),
      MES_BREAK_DURATION: this.getEnvVar(ENV_KEYS.MES_BREAK_DURATION, 1, 'number'),
      MES_QUALITY_THRESHOLD: this.getEnvVar(ENV_KEYS.MES_QUALITY_THRESHOLD, 95, 'number'),
      MES_INVENTORY_WARNING_THRESHOLD: this.getEnvVar(ENV_KEYS.MES_INVENTORY_WARNING_THRESHOLD, 10, 'number'),
      MES_EQUIPMENT_CHECK_INTERVAL: this.getEnvVar(ENV_KEYS.MES_EQUIPMENT_CHECK_INTERVAL, 300, 'number'),
      
      // Development Only
      MOCK_API: this.getEnvVar(ENV_KEYS.MOCK_API, true, 'boolean'),
      MOCK_DELAY: this.getEnvVar(ENV_KEYS.MOCK_DELAY, 1000, 'number'),
      HOT_RELOAD: this.getEnvVar(ENV_KEYS.HOT_RELOAD, true, 'boolean'),
    };
  }

  private getEnvVar<T>(
    key: string, 
    defaultValue: T, 
    type: 'string' | 'number' | 'boolean' | 'theme' | 'environment' | 'logLevel' = 'string'
  ): T {
    const value = import.meta.env[key];
    
    if (value === undefined || value === '') {
      return defaultValue;
    }

    switch (type) {
      case 'number':
        const numValue = Number(value);
        return (isNaN(numValue) ? defaultValue : numValue) as T;
      
      case 'boolean':
        return (value === 'true' || value === '1') as T;
      
      case 'theme':
        return (value === 'light' || value === 'dark' ? value : defaultValue) as T;
      
      case 'environment':
        return (['development', 'staging', 'production'].includes(value) ? value : defaultValue) as T;
      
      case 'logLevel':
        return (['debug', 'info', 'warn', 'error'].includes(value) ? value : defaultValue) as T;
      
      default:
        return value as T;
    }
  }

  public getConfig(): EnvConfig {
    if (!this.config) {
      this.loadConfig();
    }
    return this.config!;
  }

  public get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.getConfig()[key];
  }

  public isDevelopment(): boolean {
    return this.get('ENVIRONMENT') === 'development';
  }

  public isProduction(): boolean {
    return this.get('ENVIRONMENT') === 'production';
  }

  public isStaging(): boolean {
    return this.get('ENVIRONMENT') === 'staging';
  }

  public isDebugMode(): boolean {
    return this.get('ENABLE_DEBUG_MODE') || this.isDevelopment();
  }

  public isMaintenanceMode(): boolean {
    return this.get('ENABLE_MAINTENANCE_MODE');
  }

  public getApiUrl(endpoint: string = ''): string {
    const baseUrl = this.get('API_BASE_URL');
    return endpoint ? `${baseUrl}/${endpoint.replace(/^\//, '')}` : baseUrl;
  }

  public getWebSocketUrl(): string {
    return this.get('WEBSOCKET_URL');
  }

  public getFileUploadUrl(): string {
    return this.get('FILE_UPLOAD_URL');
  }

  public getReportGenerationUrl(): string {
    return this.get('REPORT_GENERATION_URL');
  }

  // MES specific getters
  public getCompanyName(): string {
    return this.get('MES_COMPANY_NAME');
  }

  public getFacilityId(): string {
    return this.get('MES_FACILITY_ID');
  }

  public getQualityThreshold(): number {
    return this.get('MES_QUALITY_THRESHOLD');
  }

  public getInventoryWarningThreshold(): number {
    return this.get('MES_INVENTORY_WARNING_THRESHOLD');
  }

  public getEquipmentCheckInterval(): number {
    return this.get('MES_EQUIPMENT_CHECK_INTERVAL');
  }

  public getShiftDuration(): number {
    return this.get('MES_SHIFT_DURATION');
  }

  public getBreakDuration(): number {
    return this.get('MES_BREAK_DURATION');
  }
}

// Export singleton instance
export const env = new EnvManager();

// Export individual getters for convenience
export const {
  getConfig,
  get,
  isDevelopment,
  isProduction,
  isStaging,
  isDebugMode,
  isMaintenanceMode,
  getApiUrl,
  getWebSocketUrl,
  getFileUploadUrl,
  getReportGenerationUrl,
  getCompanyName,
  getFacilityId,
  getQualityThreshold,
  getInventoryWarningThreshold,
  getEquipmentCheckInterval,
  getShiftDuration,
  getBreakDuration,
} = env;

export default env;
