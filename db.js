/** Database for lunchly */
require('dotenv').config();

const pg = require('pg');

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/lunchly_test`;
} else {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/lunchly`;
}

const db = new pg.Client({
	connectionString: DB_URI
});

db.connect();

module.exports = db;
