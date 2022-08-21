/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: reservations,
  });
}

/**
 * Create handler for creating reservation
 */
const reservations = []
let nextId = 1;
async function create(req, res) {
  const newReservation = req.body.data;

  const now = new Date().toISOString();
  newReservation.reservation_id = nextId++;
  newReservation.created_at = now;
  newReservation.updated_at = now;
  reservations.push(newReservation);

  res.status(201).json({
    data: newReservation
  })

}

module.exports = {
  list,
  create
};
