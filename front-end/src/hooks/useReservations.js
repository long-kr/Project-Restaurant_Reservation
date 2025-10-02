import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReservation,
  getReservation,
  listReservations,
  searchReservationsByPhone,
  updateReservation,
  updateReservationStatus,
} from '../utils/api';
import { queryKeys } from '../utils/queryClient';

/**
 * Hook to fetch reservations by date
 */
export function useReservationsByDate(date) {
  return useQuery({
    queryKey: queryKeys.reservationsByDate(date),
    queryFn: ({ signal }) => listReservations({ date }, signal),
    enabled: !!date,
  });
}

/**
 * Hook to fetch a single reservation by ID
 */
export function useReservation(reservationId) {
  return useQuery({
    queryKey: queryKeys.reservation(reservationId),
    queryFn: ({ signal }) => getReservation(reservationId, signal),
    enabled: !!reservationId,
  });
}

/**
 * Hook to search reservations by phone number
 */
export function useReservationsByPhone(phoneNumber) {
  return useQuery({
    queryKey: queryKeys.reservationsByPhone(phoneNumber),
    queryFn: ({ signal }) =>
      searchReservationsByPhone({ mobile_number: phoneNumber }, signal),
    enabled: !!phoneNumber && phoneNumber.length > 0,
  });
}

/**
 * Hook to create a new reservation
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservation, signal }) =>
      createReservation(reservation, signal),
    onSuccess: data => {
      // Invalidate and refetch reservations for the created date
      if (data?.reservation_date) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reservationsByDate(data.reservation_date),
        });
      }
      // Also invalidate general reservations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations,
      });
    },
  });
}

/**
 * Hook to update an existing reservation
 */
export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, data, signal }) =>
      updateReservation(reservationId, data, signal),
    onSuccess: (data, variables) => {
      // Update the specific reservation in cache
      queryClient.setQueryData(
        queryKeys.reservation(variables.reservationId),
        data
      );

      // Invalidate related queries
      if (data?.reservation_date) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reservationsByDate(data.reservation_date),
        });
      }

      // Invalidate general reservations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations,
      });
    },
  });
}

/**
 * Hook to update reservation status (seat, cancel, etc.)
 */
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, data, signal }) =>
      updateReservationStatus(reservationId, data, signal),
    onSuccess: (data, variables) => {
      // Update the specific reservation in cache
      queryClient.setQueryData(
        queryKeys.reservation(variables.reservationId),
        data
      );

      // Invalidate related queries
      if (data?.reservation_date) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reservationsByDate(data.reservation_date),
        });
      }

      // Invalidate general reservations list
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations,
      });
    },
  });
}
