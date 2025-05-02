import { useState } from 'react';
import axios, { AxiosRequestConfig, Method } from 'axios';

type RequestMethod = Method;

interface UseHttpRequestReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  sendRequest: (
    url: string,
    method: RequestMethod,
    body?: any,
    customHeaders?: Record<string, string>
  ) => Promise<{ data?: T; error?: string }>;
  clearError: () => void;
}

const useHttpRequest = <T,>(): UseHttpRequestReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequest = async (
    url: string,
    method: RequestMethod,
    body?: any,
    customHeaders: Record<string, string> = {}
  ): Promise<{ data?: T; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      const isFormData = body instanceof FormData;

      const config: AxiosRequestConfig = {
        method,
        url,
        data: body,
        headers: {
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
          ...customHeaders,
        },
      };

      const response = await axios.request<T>(config);
      setData(response.data);
      return { data: response.data };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    data,
    error,
    loading,
    sendRequest,
    clearError,
  };
};

export default useHttpRequest;
