const request = require('supertest');
const app = require('../../app'); 
const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('../config/db.config');
const mongoose = require('mongoose'); 


describe('Controller : Staff', () => {
  let connection;
  let db;
  let staffCollection;
  
  beforeAll(async () => {
  
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
    staffCollection = db.collection('staff');
    
    if (mongoose.connection.readyState === 0) {
    await mongoose.connect(globalThis.__MONGO_URI__);
  }
    
    await new Promise((resolve, reject) => {
    mongodb.initDb((err) => {
      if (err) reject(err);
      else resolve();
      });
    });

  });

  afterAll(async () => {
    await connection.close();
  });

  

  describe('GET /staff (getAll)', () => {
    it('should return a 200 status and a list with the staff members list', async () => {
      
      const res = await request(app).get('/staff');

      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      
      
      expect(res.body[0].firstName).toBe('Obi-Wan');
      expect(res.body[0].lastName).toBe('Kenobi');
      expect(res.body[1].firstName).toBe('Chuck');
      expect(res.body[1].lastName).toBe('Norris');
    });
  });

  describe('GET /staff/:id (getSingle)', () => {
    it('should return 200 and the specific staff member if ID is valid', async () => {
      
      const res = await request(app).get('/staff/69d836192cb3501fa1b6f79f');

      expect(res.status).toBe(200);
      expect(res.body.firstName).toBe('Obi-Wan');
      expect(res.body.lastName).toBe('Kenobi');
      expect(res.body.email).toBe('cool.jedi@example.com');
      expect(res.body.role).toBe('admin');
      expect(res.body.dateBirth).toBe('31-03-1971');
      expect(res.body.position).toBe('Master Jedi');
      expect(res.body.startDay).toBe('birth');
    });

    it('should return 404 if the ID has a valid format but it does not exist', async () => {
      
      const fakeId = new ObjectId().toString();
      
      const res = await request(app).get(`/staff/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
    it('should return a 500 status is there a problem with the server', async () => {
      const idInvalid = 'randomid'; 
      const res = await request(app).get(`/staff/${idInvalid}`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});