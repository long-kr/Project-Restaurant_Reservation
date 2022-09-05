const service = require("./reservations.service");
const asyncHandler = require("../errors/asyncErrorBoundary");
const moment = require('moment');

/**
 * Validation input data
 */
async function reservationExist(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.read(reservation_id);

  if(!reservation) {
    return next({
      status: 404,
      message: `Cannot find reservartion ID: ${reservation_id}`
    })
  };

  res.locals.reservation = reservation;
  next();
};

function hasData(req, res, next) {
  if ( req.body.data ) {
    return next();
  }

  next({
    status: 400,
    message: `Request body must have data`
  })
};

function hasProperties(propertyName) {
  return (req, res, next) => {
    const { data } = req.body;

    if (!data[propertyName]) {
      return next({ 
        status: 400,
        message: `Request must have property: ${propertyName}`
      })
    }

    next();
  };
};

function dateValid(req, res, next) {
  const { reservation_date } = req.body.data;
  
  if (Date.parse(reservation_date) > 0) {
    return next();
  }

  next({ 
    status: 400,
    message: `reservation_date must be valid.`
  })
};

function timeValid(req, res, next) {
  const { reservation_time } = req.body.data;
  const hour = Number(reservation_time.slice(0, 2));
  const minus = Number(reservation_time.slice(3, 5));

  if (hour <= 24 && hour >= 0 && minus <= 60 && minus >= 0) {
    return next();
  }

  next({ 
    status: 400,
    message: `reservation_time must be valid.`
  })
};

function guestValid(req, res, next) { 
  const { people } = req.body.data;
  
  if(typeof(people) == "number" && people > 0) {
    return next()
  }

  next({
    status: 400,
    message: `people must be a number and greater than 0`
  })
};

function closingDays(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  // Using moment package
  // For date
  const dateInput = moment(reservation_date);
  const today = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
  // For time
  const hourInput = Number(reservation_time.split(":")[0]);
  const minusInput = Number(reservation_time.split(":")[1]);
  const timeNow = new Date().getTime();
  const reserveTime = new Date().setHours(hourInput, minusInput, 0);
  const openTime = new Date().setHours(10,30,0);
  const closedTime = new Date().setHours(21,30,0);

  if(dateInput < today) {
    return next({
      status: 400,
      message: `reservation_date must be a future day.`
    })
  };

  if(dateInput.day() === 2) {
    return next({
      status: 400,
      message: `reservation_date closed on Tuesday.`
    })
  };

  if (reserveTime < openTime || reserveTime > closedTime) {
    return next({
      status: 400,
      message: `reservation_time is between 10h30 a.m and 9h30 p.m`
    })
  };

  if ( dateInput === today && timeNow > reserveTime ) {
    return next({
      status: 400,
      message: `It's passed reservation time!`
    })
  }

  next();
};

function isSeated(req, res, next) {
  const { status } = req.body.data;
  if(status === "seated") {
    return next({
      status: 400,
      message: `Reservation is already seated`
    })
  };

  next();
};

function isFinished(req, res, next) {
  const { status } = req.body.data;
  if(status === "finished") {
    return next({
      status: 400,
      message: `Reservation is already finished`
    })
  };

  next();
};

function validStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished"]

  if(!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Invalid status input: ${status}`
    })
  };

  next();
};

function validCurrentStatus(req, res, next) {
  const { status } = res.locals.reservation;

  if(status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`
    })
  }

  next();
};

/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const { date } = req.query;
  const { mobile_number } = req.query;

  if (date) {
    res.json({
      data: await service.list(date),
    })
  };

  if (mobile_number) {
    const reservations = await service.search(mobile_number);
  
    res.json({
      data: reservations,
    })
  };

};

/**
 * Read handler for table resources
 */
async function read(req, res) {
  res.json({ data: res.locals.reservation });
};


/**
 * Create handler for creating reservation
 */
async function create(req, res) {
  const newReservation = req.body.data;
  const mobile_number = newReservation.mobile_number;
  
  if(mobile_number.charAt(3) !== "-" || mobile_number.charAt(7) !== "-") {
    const newMobile_number = [];

    for (let i = 0; i < mobile_number.length; i++) {
      newMobile_number.push(mobile_number[i]);
      if( i === 2 || i === 5 ) {
        newMobile_number.push("-");
      }
    }

    newReservation.mobile_number = newMobile_number.join("");
  }

  res.status(201).json({
    data: await service.create(newReservation)
  })
};

/**
 * Update handler for status update 
 */
async function update(req, res) {
  const updateReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const updated = await service.update(updateReservation);

  res.status(200).json({ data: updated });
};

module.exports = {
  list: [
    asyncHandler(list),
  ],
  create: [
    hasData,  
    hasProperties("first_name"),
    hasProperties("last_name"),
    hasProperties("mobile_number"),
    hasProperties("people"),
    hasProperties("reservation_date"),
    hasProperties("reservation_time"),
    dateValid,
    timeValid,
    guestValid,
    closingDays,
    isSeated,
    isFinished,
    asyncHandler(create)
  ],
  read: [
    asyncHandler(reservationExist),
    asyncHandler(read),
  ],
  update: [
    asyncHandler(reservationExist),
    validStatus,
    validCurrentStatus,
    asyncHandler(update)
  ]
};