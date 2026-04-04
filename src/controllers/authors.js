const db = require('../models');
const Authors = db.authors;

exports.findAll = async (req, res) => {
  /* #swagger.tags = ['Authors']
     #swagger.summary = 'Get all library Authors'
     #swagger.description = 'Retrieves a list of all authors registered in the database.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.responses[200] = { 
        description: 'A list of library authors retrieved successfully',
        schema: [{ 
            $firstName: 'Samuel',
            $lastName: 'Clemens',
            $pseudonym: 'Mark Twain',
            birthDate: '1835-11-30',
            deathDate: '1910-04-21',
            nationality: 'American',
            mainGenre: 'Fiction',
            books: ['The Great Gatsby', 'To Kill a Mockingbird']
        }]
     }

     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the author list' 
     }
  */
  try {
    const data = await Authors.find();
    if (!data) {
      return res.status(400).send({ message: 'Error retrieving authors data' });
    }
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving authors.',
    });
  }
};

exports.findOne = async (req, res) => {
  /* #swagger.tags = ['Authors']
     #swagger.summary = 'Get a single author by ID'
     #swagger.description = 'Retrieves a specific author from the library collection using their unique MongoDB ObjectId.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['author_id'] = {
        in: 'path',
        description: 'The unique ID of the author',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Author found and retrieved successfully',
        schema: { 
            $firstName: 'Samuel',
            $lastName: 'Clemens',
            $pseudonym: 'Mark Twain',
            birthDate: '1835-11-30',
            deathDate: '1910-04-21',
            nationality: 'American',
            mainGenre: 'Fiction',
            books: ['The Great Gatsby', 'To Kill a Mockingbird']
        }
     }
     #swagger.responses[404] = { 
        description: 'Author not found in the library collection' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the author details' 
     }
  */
  const id = req.params.author_id;
  try {
    const data = await Authors.findById(id);
    if (!data) {
      return res
        .status(400)
        .send({ message: 'Not found author with id: ' + id });
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error retrieving author with id: ' + id });
  }
};

exports.create = async (req, res) => {
  /* #swagger.tags = ['Authors']
     #swagger.summary = 'Create a new author'
     #swagger.description = 'Creates a new author after validating their information.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'New author information',
        required: true,
        schema: {
        firstName: "John",
        lastName: "Doe",
        pseudonym: "John Doe",
        birthDate: "1980-01-01",
        deathDate: "2020-01-01",
        nationality: "American",
        mainGenre: "Fiction",
        books: ["Book 1", "Book 2"]
    }
    }

    #swagger.responses[201] = { 
        description: 'Author created successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  if (!req.body.firstName) {
    return res.status(400).send({
      message: 'Content can not be empty',
    });
  }

  const author = new Authors({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pseudonym: req.body.pseudonym,
    birthDate: req.body.birthDate,
    deathDate: req.body.deathDate,
    nationality: req.body.nationality,
    mainGenre: req.body.mainGenre,
    books: req.body.books,
  });

  try {
    const data = await author.save();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Some error occurred while creating the author.',
    });
  }
};

exports.update = async (req, res) => {
  /* #swagger.tags = ['Authors']
     #swagger.summary = 'Update an author'
     #swagger.description = 'Updates an existing author by their ID.'
     #swagger.security = [{ "github_auth": [] }]

      #swagger.parameters['author_id'] = {
        in: 'path',
        description: 'The unique ID of the author to update',
        required: true,
        type: 'string'
      }

     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user information',
        required: true,
        schema: {
        firstName: "John",
        lastName: "Doe",
        pseudonym: "John Doe",
        birthDate: "1980-01-01",
        deathDate: "2020-01-01",
        nationality: "American",
        mainGenre: "Fiction",
        books: ["Book 1", "Book 2"]
    }
    }

    #swagger.responses[204] = { 
        description: 'Author information updated successfully',
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

  const id = req.params.author_id;
  try {
    const data = await Authors.findByIdAndUpdate(id, req.body);
    if (!data) {
      return res.status(400).send({
        message: `Cannot update author with id: ${id}.`,
      });
    }
    res.send({ message: 'Author was updated successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Error updating author with id: ' + id,
    });
  }
};

exports.delete = async (req, res) => {
  /* #swagger.tags = ['Authors']
     #swagger.summary = 'Delete an author'
     #swagger.description = 'Permanently removes an author from the database using their unique ID.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['author_id'] = {
        in: 'path',
        description: 'The unique ID of the author to delete',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Author deleted successfully.' 
     }
     #swagger.responses[404] = { 
        description: 'Author not found. No deletion was performed.' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while attempting to delete the author' 
     }
  */
  const id = req.params.author_id;
  try {
    const data = await Authors.findByIdAndDelete(id);
    if (!data) {
      return res.status(400).send({
        message: `Cannot delete author with id:${id}`,
      });
    }
    res.send({ message: 'Author was deleted successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: 'Error deleting author with id: ' + id,
    });
  }
};
