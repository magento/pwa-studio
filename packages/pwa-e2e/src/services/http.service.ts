import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from 'utils/ioc';

@Injectable()
export class HttpService {
  public constructor(
    private baseUrl: string = '',
    private config: AxiosRequestConfig = { baseURL: baseUrl }
  ) { }
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return Axios.get<T>(url, config || this.config);
  }

  protected async post<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request = await Axios.post<T>(url, data, config || this.config);

    return request;
  }

  protected async put<T, U>(url: string, data?: U, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request = await Axios.put<T>(url, data, config || this.config);

    return request;
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request: AxiosResponse<T> = await Axios.delete(url, config || this.config);

    return request;
  }

  public get Config(): AxiosRequestConfig { 
    return this.config;
  }
}
