export interface Environment {
  [name: string]: any;
  baseUrl: string;
  browser?: string;
  headless: boolean;
}
