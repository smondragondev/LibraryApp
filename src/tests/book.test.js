const request = require('supertest');
const app = require('../../app'); 
const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('../config/db.config');
const mongoose = require('mongoose'); 


describe('Controller : Books', () => {
  let connection;
  let db;
  let booksCollection;
  
  beforeAll(async () => {
  
    connection = await MongoClient.connect(globalThis.__MONGO_URI__);
    db = await connection.db(globalThis.__MONGO_DB_NAME__);
    booksCollection = db.collection('books');
    
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

  

  describe('GET /books (getAll)', () => {
    it('should return a 200 status and a list with the books lits', async () => {
      
      const res = await request(app).get('/books');

      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(4);
      
      
      expect(res.body[0].title).toBe('The Great Gatsby');
      expect(res.body[1].title).toBe('To Kill a Mockingbird');
      expect(res.body[2].title).toBe('1984');
      expect(res.body[3].title).toBe('Mocking Book');
    });
  });

  describe('GET /books/:id (getSingle)', () => {
    it('should return 200 and the specific book if ID is valid', async () => {
      
      const res = await request(app).get('/books/69d1380da96d044ab81db11d');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('The Great Gatsby');
      expect(res.body.author).toBe('F. Scott Fitzgerald');
      expect(res.body.genre).toBe('Fiction');
      expect(res.body.publishedYear).toBe(1925);
      expect(res.body.isbn).toBe('978-0-7432-7356-5');
    });

    it('should return 404 if the ID has a valid format but it does not exist', async () => {
      
      const fakeId = new ObjectId().toString();
      
      const res = await request(app).get(`/books/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Book not found.');
    });
    it('should return a 500 status is there a problem with the server', async () => {
      const idInvalid = 'randomid'; 
      const res = await request(app).get(`/books/${idInvalid}`);
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
});