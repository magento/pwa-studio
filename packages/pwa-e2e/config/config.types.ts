export interface Environment {
  [name: string]: EnvironmentInfo;
}
interface EnvironmentInfo {
  baseUrl: string;
}

export interface DotEnvConfig {
  [name: string]: any;
  environment?: 'production' | 'stage' | 'local';
  headless?: boolean;
  url: string;
  mobile_emulation: boolean;
  mobile_width?: number;
  mobile_height?: number;
}
