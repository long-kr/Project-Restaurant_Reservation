# Project: Restaurant-reservation-manage-app
- Live version: https://final-cap-reservations-cliend.vercel.app/dashboard

## Installation
1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

### API endpoint:
| Endpoint | return |
| ----------- | ----------- |
| GET /reservations?date=yyyy-mm-dd | respone with list of all reservations by `date` |
| GET /reservations?mobile_number=xxxxxxxxxx | respone with list of all reservation by `mobile_number` |
| POST /reservations | send `POST` request to server to create new reservation |
| GET /reservations/:reservation_id | respone detail of reservation by `reservation_id` |
| PUT /reservations/:reservation_id | send a `PUT` request to server to update reservation |
| PUT /reservation/:reservation_id/status | send a `PUT` request to server to update reservation `status` |
| GET /tables | respone with list of all tables |
| POST /tables | send a `POST` request to server to create new table |
| PUT /tables/table_id/status | send a `PUT` request to assign a `reservation_id` to table and change reseration `status` |
| DELETE /tables/table_id/status | send a `DELETE` request to remove a `reservation_id` off table and change reservation `status` |

### Client:
- This web can be used by restaurant manages to create, update, and set seat for customer's reservations.

| path | summary |
| ----------- | ----------- |
| /dashboard  | list of reservations and tables |
| /search | search reservations by phone number |
| /reservations/new | create new reservation |
| /reservations/:reservation_id/seat | assign table for reservation |
| /reservations/:reservation_id/edit | edit an existing reservation |
| /tables/new | create new table | 

 ![alt pic1](https://i.ibb.co/4NcbPWx/pic1.png)
 
 - `Previous day` `Today` `Next day` buttons are used to move desire day.
 - `Seat` button use to assign table.
 - `Cancel` will cancel reservation and remove it from dashboard.
 - You can use `finish` button to free a table.
 - Create new reservation will be restricted if past days, tuesday, or post time. 
 - Reservation time must be between 10h30 a.m and 9h30 p.m.
 - Number of guest must be smaller than table capacity in order to set seat.
 - I didn't add validation for phone number since everyone can use it.
