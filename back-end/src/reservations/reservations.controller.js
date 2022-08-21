const service = require("./reservations.service");
const asyncHandler = require("../errors/asyncErrorBoundary");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  
  res.json({
    data: await service.list(date),
  });
}

/**
 * validation input data
 */
function hasData(propertyName) {
  return (req, res, next) => {
    const { data } = req.body;

    if (!data[propertyName]) {
      return next({ 
        status: 400,
        message: `Request must have ${propertyName}`
      })
    }

    next();
  };
};


/**
 * Create handler for creating reservation
 */
async function create(req, res) {
  
  const newReservation = await service.create(req.body.data);
  
  res.status(201).json({
    data: newReservation
  })
}

module.exports = {
  list,
  create: [hasData("first_name"),
           hasData("last_name"),
           hasData("mobile_number"),
           hasData("reservation_date"),
           hasData("reservation_time"),
           asyncHandler(create)]
};
