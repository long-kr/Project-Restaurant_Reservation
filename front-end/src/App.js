import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

import React from 'react';
import { ErrorBoundary, ErrorPage } from './components/error';
import Layout from './components/layout/Layout';
import NotFound from './components/layout/NotFound';
import ReservationCreate from './reservations/ReservationCreate';
import ReservationsEdit from './reservations/ReservationsEdit';
import Search from './search/Search';
import SetReservationSeat from './seats/SetReservationSeat';
import TableCreate from './tables/TableCreate';
import { queryClient } from './utils/queryClient';
import { routes } from './utils/routes';

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      ...[routes.dashboard, routes.reservations].map(path => ({
        path,
        element: <Dashboard />,
      })),
      { path: routes.reservationsNew, element: <ReservationCreate /> },
      {
        path: routes.reservationsEdit(':reservation_id'),
        element: <ReservationsEdit />,
      },
      {
        path: routes.reservationsSeat(':reservation_id'),
        element: <SetReservationSeat />,
      },
      { path: routes.tablesNew, element: <TableCreate /> },
      { path: routes.search, element: <Search /> },
      { path: routes.notFound, element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider future={{ v7_startTransition: true }} router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
