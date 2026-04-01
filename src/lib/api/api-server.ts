/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'

import { $api } from './axios'

export const getApiServer = async () => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()

  const config: AxiosRequestConfig = {
    headers: { Cookie: allCookies },
    withCredentials: true
  }

  return {
    get: <T>(url: string, extraConfig?: AxiosRequestConfig) =>
      $api.get<T>(url, { ...config, ...extraConfig }),

    post: <T>(url: string, data?: any, extraConfig?: AxiosRequestConfig) =>
      $api.post<T>(url, data, { ...config, ...extraConfig }),

    put: <T>(url: string, data?: any, extraConfig?: AxiosRequestConfig) =>
      $api.put<T>(url, data, { ...config, ...extraConfig }),

    patch: <T>(url: string, data?: any, extraConfig?: AxiosRequestConfig) =>
      $api.patch<T>(url, data, { ...config, ...extraConfig }),

    delete: <T>(url: string, extraConfig?: AxiosRequestConfig) =>
      $api.delete<T>(url, { ...config, ...extraConfig })
  }
}
