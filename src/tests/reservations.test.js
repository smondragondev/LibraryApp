const request = require('supertest');
const app = require('../../app');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Reservation = require('../models').reservations;

describe('Controller: Reservations', () => {

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(globalThis.__MONGO_URI__);
        }
        await Reservation.create({
            _id: new ObjectId('69d883018b2f1fe6a11c24e4'),
            book: new ObjectId('69d1380da96d044ab81db11d'),
            contact: new ObjectId('69d137bc664107536435dd92'),
            issuedDate: new Date('1928-04-15'),
            returnedDate: new Date('2023-11-02'),
            status: 'active'
        })
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('GET /reservations (getAll)', () => {
        it('should return a 200 status and a list with the reservations', async () => {

            const res = await request(app).get('/reservations');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return JSON content type', async () => {
            const res = await request(app).get('/reservations');
            expect(res.header['content-type']).toMatch(/json/);
        });

    });

    describe('GET /reservations/:reservation_id (getSingle)', () => {
        it('should return 200 and the specific reservation if ID is valid', async () => {

            const res = await request(app).get('/reservations/69d883018b2f1fe6a11c24e4');
            expect(res.status).toBe(200);
            expect(res.body.book).toBe('69d1380da96d044ab81db11d');
            expect(res.body.contact).toBe('69d137bc664107536435dd92');
            expect(res.body.issuedDate).toBe('1928-04-15T00:00:00.000Z');
            expect(res.body.returnedDate).toBe('2023-11-02T00:00:00.000Z');
            expect(res.body.status).toBe('active');
        });

        it('should return 200 and the expected fields if ID is valid', async () => {

            const res = await request(app).get('/reservations/69d883018b2f1fe6a11c24e4');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('book');
            expect(res.body).toHaveProperty('contact');
            expect(res.body).toHaveProperty('issuedDate');
            expect(res.body).toHaveProperty('returnedDate');
            expect(res.body).toHaveProperty('status');

        });

        it('should return 404 if the ID has a valid format but it does not exist', async () => {

            const fakeId = new ObjectId().toString();

            const res = await request(app).get(`/reservations/${fakeId}`);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe(`Not found reservation with id: ${fakeId}`);
        });

        it('should return a 500 status is there an invalid ID with the server', async () => {
            const idInvalid = 'randomid';
            const res = await request(app).get(`/reservations/${idInvalid}`);
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Error retrieving reservation with id: randomid");
        });
    });
});

