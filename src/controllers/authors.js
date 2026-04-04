const db = require('../models');
const Authors = db.authors;

exports.findAll = async (req, res) => {
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
    res.status(500).send({ message: 'Error retrieving author with id: ' + id });
  }
};

exports.create = async (req, res) => {
  /* #swagger.description = 'Endpoint to create a new author in the database.'
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'Author create data',
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
} */
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
    res.status(500).send({
      message: 'Some error occurred while creating the author.',
    });
  }
};

exports.update = async (req, res) => {
  /* #swagger.description = 'Endpoint to update an existing author by its ID.'
    #swagger.parameters['body'] = {
    in: 'body',
    description: 'Author update data',
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
} */
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
    res.status(500).send({
      message: 'Error updating author with id: ' + id,
    });
  }
};

exports.delete = async (req, res) => {
  /* #swagger.description = 'Endpoint to delete an existing author by its ID.' */
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
    res.status(500).send({
      message: 'Error deleting author with id: ' + id,
    });
  }
};
