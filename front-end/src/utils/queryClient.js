import { QueryClient } from '@tanstack/react-query';

/**
 * Creates and configures the React Query client with default options
 * for caching, stale time, and error handling.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  // Reservations
  reservations: ['reservations'],
  reservationsByDate: date => ['reservations', 'date', date],
  reservation: id => ['reservations', id],
  reservationsByPhone: phone => ['reservations', 'phone', phone],

  // Tables
  tables: ['tables'],
  table: id => ['tables', id],
};
