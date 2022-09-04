const service = require("./tables.service");
const reservartionService = require("../reservations/reservations.service");
const asyncHandler = require("../errors/asyncErrorBoundary");

/**
 * Validation input data
 */
async function tableExist(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if(!table) {
        return next({
            status: 404,
            message: `Table ID cannot be found: ${table_id}`
        })
    };

    res.locals.table = table;
    next();
};

function hasData(req, res, next) {
    if( !req.body.data ) {
        return next({
            status: 400,
            message: `Request body must have data`
        })
    };

    next();    
};

function hasProperties(propertyName) {
    return (req, res, next) => {
        const { data } = req.body;
        
        if(!data[propertyName]) {
          return next({
            status: 400,
            message: `Request must have property: ${propertyName}`
          })  
        };

        next();
    };
};

function validTableName(req, res, next) {
    const { table_name } = req.body.data;

    if(table_name.length < 2) {
        return next({
            status: 400,
            message: `table_name must be at least 2 characters long`
        });
    };

    next();
};

function validCapacity(req, res, next) {
    const { capacity } = req.body.data;

    if(typeof(capacity) !== "number"|| capacity < 1) {
        return next({
            status: 400,
            message: `capacity must be atleast 1 and must be a number`
        })
    };

    next();
};

function validReservaionId(req, res, next) {
    const { reservation_id } = req.body.data;

    if(!reservation_id) {
        return next({
            status: 400,
            message: `must have reservation_id to assign seat`
        })
    };

    next();
};

async function reservartionExist(req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await reservartionService.read(reservation_id);

    if(!reservation) {
        return next({
            status: 404,
            message: `Reservation ID cannot be found: ${reservation_id}`
        })
    }

    res.locals.reservation = reservation;
    next();
};

function validUpdateProperty(req, res, next) {
    const { data } = req.body;

    const invalidField = Object.keys(data).filter((key) => {
        return key !== "reservation_id"
    });
 
    if(invalidField.length) {
        return next({
            status: 400,
            message: `invalid field(s): ${invalidField.join(", ")}`
        })
    };

    next();
};

function maxPeople(req, res, next) {
    const { capacity } = res.locals.table;
    const { people } = res.locals.reservation;

    if(people > capacity) {
        return next({
            status: 400,
            message: `Number of people are greater than table capacity`
        })
    };

    next();
};

function isTableFree(req, res, next) {
    const { reservation_id } = res.locals.table;

    if(reservation_id) {
        return next({
            status: 400,
            message: `Table is already occupied`
        })
    };

    next();
};

function isTableOcccupied(req, res, next) {
    const { reservation_id } = res.locals.table;

    if(!reservation_id) {
        return next({
            status: 400,
            message: `Table is not occupied`
        })
    };

    next();
};

function isReservationSeated(req, res, next) {
    const { status } = res.locals.reservation;

    if(status === "seated") {
        return next({
            status: 400,
            message: `Reservation is already being seated`
        })
    };

    next();
}
/**
 * GET handler for table resources
 */
 async function list(req, res) {
    res.json({ data: await service.list() });
};

/**
 * GET handler for table resources
 */
async function read(req, res) {
    res.json({ data: res.locals.table});
};

/**
 * POST handler for table resources
 */
async function create(req, res) {
    const newTable = await service.create(req.body.data);

    res.status(201).json({      
        data: newTable
    });
};

/**
 * PUT handler for table resources
 */
async function update(req, res) {
    const updateTable = {
        ...req.body.data,
        table_id: res.locals.table.table_id
    }
    console.log(updateTable);
    const updated = await service.update(updateTable);
    res.status(200).json({ data: updated })
};

/**
 * DELETE handler for table resources
 */ 
async function destroy(req, res) {
    const deleted = await service.destroy(res.locals.table);
    res.status(200).json("deleted");
};

module.exports = {
    list,
    read: [ asyncHandler(tableExist), asyncHandler(read) ],
    create: [
        hasData,
        hasProperties("table_name"),
        hasProperties("capacity"),
        validTableName,
        validCapacity,
        asyncHandler(create),
    ],
    update: [
        asyncHandler(tableExist),
        hasData,
        validReservaionId,
        asyncHandler(reservartionExist),
        validUpdateProperty,
        maxPeople,
        isTableFree,
        isReservationSeated,
        asyncHandler(update)
    ],
    delete: [
        asyncHandler(tableExist),
        isTableOcccupied,
        asyncHandler(destroy),
    ]
};