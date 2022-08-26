const service = require("./reservations.service");
const asyncHandler = require("../errors/asyncErrorBoundary");
const moment = require('moment');

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
 * Validation input data
 */
function hasData(req, res, next) {
  if ( req.body.data ) {
    return next();
  }

  next({
    status: 400,
    message: `Request body must have data`
  })
}

function hasValidProperties(propertyName) {
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
}

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
}

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
  }

  if (reserveTime < openTime || reserveTime > closedTime) {
    return next({
      status: 400,
      message: `reservation_time is between 10h30 a.m and 9h30 p.m`
    })
  }

  if ( dateInput === minDate && timeNow > reserveTime ) {
    return next({
      status: 400,
      message: `It's passed reservation time!`
    })
  }

  next({
    status:400,
    message: `testing`
  });
}


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

module.exports = {
  list,
  create: [hasData,  
           hasValidProperties("first_name"),
           hasValidProperties("last_name"),
           hasValidProperties("mobile_number"),
           hasValidProperties("people"),
           hasValidProperties("reservation_date"),
           hasValidProperties("reservation_time"),
           dateValid,
           timeValid,
           guestValid,
           closingDays,
           asyncHandler(create)]
};
