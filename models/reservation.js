/** Reservation for Lunchly */

const moment = require('moment');
const { DateTime } = require('luxon');

const db = require('../db');

const now = DateTime.local();

/** A reservation for a party */

class Reservation {
	constructor({ id, customerId, numGuests, startAt, notes }) {
		this.id = id;
		this.customerId = customerId;
		this.numGuests = numGuests;
		this.startAt = startAt;
		this.notes = notes;
	}

	set notes(val) {
		this._notes = val || '';
	}

	get notes() {
		return this._notes;
	}

	set numGuests(val) {
		if (val < 1) {
			throw new Error('Must have at least one guest for a reservation');
		}
		this._numGuests = val;
	}

	get numGuests() {
		return this._numGuests;
	}

	set startAt(val) {
		// if (!this.startAt) {
		// 	if (val instanceof Date && val < new Date()) {
		// 		throw new Error('Reservation start date must be in the future');
		// 	}
		// }
		if (val instanceof Date) {
			this._startAt = val;
		} else {
			throw new Error('Start date must be a Date object');
		}
	}

	get startAt() {
		return this._startAt;
	}

	/** formatter for startAt */

	getFormattedStartAt() {
		return this.startAt.toLocaleString(DateTime.DATETIME_MED);
	}

	get relativeStartAt() {
		//get start date for reservation that is relative to current time
		const splitDate = this.startAt.toString().match(/(\w{3}\s\w{3}\s\d{1,2}\s\d{4})*/);
		const formattedDate = splitDate[0];
		const date = DateTime.fromFormat(formattedDate, 'EEE MMM dd yyyy');
		const diffInDays = now.diff(date, 'days');
		return now.minus({ days: diffInDays.values.days.toFixed(0) }).toRelativeCalendar();
	}

	/** given a customer id, find their reservations. */

	static async getReservationsForCustomer(customerId) {
		const results = await db.query(
			`SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
			[customerId]
		);

		return results.rows.map(row => new Reservation(row));
	}
	async save() {
		if (this.id === undefined) {
			const result = await db.query(
				`INSERT INTO reservations (customer_id, num_guests, start_at, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
				[this.customerId, this.numGuests, this.startAt, this.notes]
			);
			this.id = result.rows[0].id;
		} else {
			await db.query(
				`UPDATE reservations SET customer_id=$1, num_guests=$2, start=$3, notes=$4
             WHERE id=$5`,
				[this.customerId, this.numGuests, this.start, this.notes, this.id]
			);
		}
	}
}

module.exports = Reservation;
