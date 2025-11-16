// hooks/useApi.ts
import { useState, useEffect } from 'react';

interface ApiOptions<T> {
  immediate?: boolean;
  initialData?: T;
}

export function useApi<T>(
  url: string,
  options: ApiOptions<T> = { immediate: false }
) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchData = async (params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query string from params
      const queryString = params 
        ? `?${new URLSearchParams(params).toString()}`
        : '';
      
      const response = await fetch(`${url}${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setTotal(result.total || result.data.length);
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, []);

  return { data, loading, error, total, fetchData };
}