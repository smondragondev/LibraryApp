const app = require('./app'); 
const db = require('./src/models');
const mongoDB = require('./src/config/db.config');

const port = process.env.PORT || 3000;

// DATABASE MONGOOSE
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database with Mongoose!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

// DATABASE NATIVE & SERVER START
mongoDB.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node running on port ${port}`);
    });
  }
});