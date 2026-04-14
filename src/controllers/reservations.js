const db = require('../models');
const Reservations = db.reservations;
const { getBookById } = require('../models/book');
const { getUserById } = require('../models/contact');

const BSONError = require("mongodb/lib/bson").BSONError;

exports.findAll = async (req, res) => {
  /* #swagger.tags = ['Reservations']
     #swagger.summary = 'Get all library Reservations'
     #swagger.description = 'Retrieves a list of all Reservations registered in the database.'

     #swagger.responses[200] = { 
        description: 'A list of library Reservations retrieved successfully',
        schema: [{ $ref: '#/definitions/GetReservation' }]
     }

     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the Reservations list' 
     }
  */
  try {
    const data = await Reservations.find();
    if (!data) {
      return res.status(404).send({ message: 'There is no data.' });
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving Reservations.',
    });
  }
};

exports.findOne = async (req, res) => {
  /* #swagger.tags = ['Reservations']
     #swagger.summary = 'Get a single reservation by ID'
     #swagger.description = 'Retrieves a specific reservation from the library collection using their unique MongoDB ObjectId.'
     

     #swagger.parameters['reservation_id'] = {
        in: 'path',
        description: 'The unique ID of the reservation',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'reservation found and retrieved successfully',
        schema: { $ref: '#/definitions/GetReservation' }
     }
     #swagger.responses[404] = { 
        description: 'reservation not found in the library collection' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the reservation details' 
     }
  */
  const id = req.params.reservation_id;
  try {
    const data = await Reservations.findById(id);
    if (!data) {
      return res
        .status(404)
        .send({ message: 'Not found reservation with id: ' + id });
    }
    res.send(data);
  } catch (err) {
    if (err instanceof BSONError) {
      return res.status(400).send({ message: 'Invalid Reservation ID: ' + id });
    }
    res.status(500).send({ message: 'Error retrieving reservation with id: ' + id });
  }
};

exports.create = async (req, res) => {
  /* 
    #swagger.tags = ['Reservations']
    #swagger.summary = 'Create a new reservation'
    #swagger.description = 'Creates a new reservation after validating their information.'
    #swagger.security = [{ "github_auth": [] }]
    
    #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new reservation.',
            schema: { $ref: '#/definitions/CreateUpdateReservation' }    
    }
    #swagger.responses[201] = { 
        description: 'reservation created successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const book = await getBookById(req.body.book_id);
  const contact = await getUserById(req.body.contact_id);
  const reservation = new Reservations({
    book,
    contact,
    issuedDate: req.body.issuedDate,
    returnedDate: req.body.returnedDate,
    status: req.body.status,
  });

  try {
    const data = await reservation.save();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Some error occurred while creating the reservation.',
    });
  }
};

exports.update = async (req, res) => {
  /* #swagger.tags = ['Reservations']
     #swagger.summary = 'Update an reservation'
     #swagger.description = 'Updates an existing reservation by their ID.'
     #swagger.security = [{ "github_auth": [] }]

      #swagger.parameters['reservation_id'] = {
        in: 'path',
        description: 'The unique ID of the reservation to update',
        required: true,
        type: 'string'
      }

     #swagger.parameters['body'] = {
            in: 'body',
            description: 'Create a new reservation.',
            schema: { $ref: '#/definitions/CreateUpdateReservation' }    
    }
    #swagger.responses[204] = { 
        description: 'reservation information updated successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.reservation_id;
  try {
    const book = await getBookById(req.body.book_id);
    const contact = await getUserById(req.body.contact_id);
    const reservation = {
      book,
      contact,
      issuedDate: req.body.issuedDate,
      returnedDate: req.body.returnedDate,
      status: req.body.status,
    };
    const data = await Reservations.findByIdAndUpdate(id, reservation);
    if (!data) {
      return res.status(400).send({
        message: `Cannot update reservation with id: ${id}.`,
      });
    }
    res.send({ data, message: 'Reservation was updated successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Error updating reservation with id: ' + id,
    });
  }
};

exports.delete = async (req, res) => {
  /* #swagger.tags = ['Reservations']
     #swagger.summary = 'Delete an reservation'
     #swagger.description = 'Permanently removes an reservation from the database using their unique ID.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['reservation_id'] = {
        in: 'path',
        description: 'The unique ID of the reservation to delete',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'reservation deleted successfully.' 
     }
     #swagger.responses[404] = { 
        description: 'reservation not found. No deletion was performed.' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while attempting to delete the reservation' 
     }
  */
  const id = req.params.reservation_id;
  try {
    const data = await Reservations.findByIdAndDelete(id);
    if (!data) {
      return res.status(400).send({
        message: `Cannot delete reservation with id:${id}`,
      });
    }
    res.send({ message: 'reservation was deleted successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Error deleting reservation with id: ' + id,
    });
  }
};
