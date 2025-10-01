import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createTable,
	deleteTable,
	listTable,
	seatingTable,
	unSeatingTable,
} from "../utils/api";
import { queryKeys } from "../utils/queryClient";

/**
 * Hook to fetch all tables
 */
export function useTables() {
	return useQuery({
		queryKey: queryKeys.tables,
		queryFn: ({ signal }) => listTable(signal),
	});
}

/**
 * Hook to create a new table
 */
export function useCreateTable() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ table, signal }) => createTable(table, signal),
		onSuccess: () => {
			// Invalidate tables list to refetch
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables,
			});
		},
	});
}

/**
 * Hook to seat a reservation at a table
 */
export function useSeatTable() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ tableId, data, signal }) =>
			seatingTable(tableId, data, signal),
		onSuccess: (data, variables) => {
			// Update the specific table in cache
			queryClient.setQueryData(queryKeys.table(variables.tableId), data);

			// Invalidate tables list
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables,
			});

			// Invalidate reservations for the date if we have reservation data
			if (data?.reservation_id) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.reservations,
				});
			}
		},
	});
}

/**
 * Hook to unseat a table (finish table)
 */
export function useUnseatTable() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ tableId, signal }) => unSeatingTable(tableId, signal),
		onSuccess: (data, variables) => {
			// Update the specific table in cache
			queryClient.setQueryData(queryKeys.table(variables.tableId), data);

			// Invalidate tables list
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables,
			});

			// Invalidate reservations list to update status
			queryClient.invalidateQueries({
				queryKey: queryKeys.reservations,
			});
		},
	});
}

/**
 * Hook to delete a table
 */
export function useDeleteTable() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ tableId, signal }) => deleteTable(tableId, signal),
		onSuccess: () => {
			// Invalidate tables list to refetch
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables,
			});
		},
	});
}
