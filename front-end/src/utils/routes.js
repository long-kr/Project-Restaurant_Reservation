export const routes = {
  dashboard: '/dashboard',
  reservations: '/reservations',
  reservationsNew: '/reservations/new',
  reservationsSeat: reservationId => `/reservations/${reservationId}/seat`,
  reservationsEdit: reservationId => `/reservations/${reservationId}/edit`,
  tablesNew: '/tables/new',
  search: '/search',
  notFound: '*',
};
