require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();
const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || 'localhost'
const isDevelopment = process.env.ENV === 'development';
const schema = isDevelopment ? 'http' : 'https';
const host = isDevelopment ? `${domain}:${port}` : `${domain}`;

console.log('ENV:', process.env.ENV, '| isDevelopment:', isDevelopment);
const doc = {
    info: {
        title: 'Library API',
        description: 'This API is a ...'
    },
    host: host,
    schemes: [schema],
    definitions: {
        CreateUpdateReservation: {
            $book_id: '69d1380da96d044ab81db11d',
            $contact_id: '69d137bc664107536435dd92',
            $issuedDate: '1928-04-15',
            returnedDate: '2023-11-02',
            status: 'active'
        },
    }
}

const outputFile = './swagger.json';
const routes = ['./src/routes/index.js'];


swaggerAutogen(outputFile, routes, doc);