const Book = require('../models/book');

const getAll = async (req, res) => {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Get all library books'
     #swagger.description = 'Retrieves a list of all library books registered in the database.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.responses[200] = { 
        description: 'A list of library users retrieved successfully',
        schema: [{ 
            $title: 'Amazing Book', 
            $author: 'Jane Doe', 
            $genre: 'Adventure',
            $publishedYear: '2018',
            $isbn: '978-0743273565'
        }]
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the book list' 
     }
  */
  try {
    const books = await Book.getAllBooks();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving books.' });
  }
};

const getSingle = async (req, res) => {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Get a single book by ID'
     #swagger.description = 'Retrieves a specific book from the library collection using its unique MongoDB ObjectId.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the book',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Book found and retrieved successfully',
        schema: { 
            $title: 'Amazing Book', 
            $author: 'Jane Doe', 
            $genre: 'Adventure',
            $publishedYear: '2018',
            $isbn: '978-0743273565'
        }
     }
     #swagger.responses[404] = { 
        description: 'Book not found in the library collection' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the book details' 
     }
  */
  try {
    const book = await Book.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving book.' });
  }
};

const createBook = async (req, res) => {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Create a new book'
     #swagger.description = 'Creates a new book after validating title, author, genre, publishedYear, isbn.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'New book information',
        required: true,
        schema: { 
            $title: 'Amazing Book', 
            $author: 'Jane Doe', 
            $genre: 'Adventure',
            $publishedYear: '2018',
            $isbn: '978-0743273565'
        }
    }

    #swagger.responses[201] = { 
        description: 'Book created successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const { title, author, genre, publishedYear, isbn } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string.' });
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json({ error: 'author is required and must be a non-empty string.' });
  }
  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    return res.status(400).json({ error: 'genre is required and must be a non-empty string.' });
  }
  if (!publishedYear || isNaN(Number(publishedYear))) {
    return res.status(400).json({ error: 'publishedYear is required and must be a number.' });
  }
  if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
    return res.status(400).json({ error: 'isbn is required and must be a non-empty string.' });
  }

  try {
    const book = { title, author, genre, publishedYear: Number(publishedYear), isbn };
    const result = await Book.createBook(book);
    if (result.insertedId) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the book.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while creating the book.' });
  }
};

const updateBook = async (req, res) => {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Update a book information'
     #swagger.description = 'Updates the book information after validating title, author, genre, publishedYear, isbn.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user information',
        required: true,
        schema: { 
            $title: 'Amazing Book', 
            $author: 'Jane Doe', 
            $genre: 'Adventure',
            $publishedYear: '2018',
            $isbn: '978-0743273565'
        }
    }

    #swagger.responses[204] = { 
        description: 'Book information updated successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const { title, author, genre, publishedYear, isbn } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string.' });
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json({ error: 'author is required and must be a non-empty string.' });
  }
  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    return res.status(400).json({ error: 'genre is required and must be a non-empty string.' });
  }
  if (!publishedYear || isNaN(Number(publishedYear))) {
    return res.status(400).json({ error: 'publishedYear is required and must be a number.' });
  }
  if (!isbn || typeof isbn !== 'string' || isbn.trim() === '') {
    return res.status(400).json({ error: 'isbn is required and must be a non-empty string.' });
  }

  try {
    const book = { title, author, genre, publishedYear: Number(publishedYear), isbn };
    const result = await Book.updateBook(req.params.id, book);
    if (result.matchedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Book not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while updating the book.' });
  }
};

const deleteBook = async (req, res) => {
  /* #swagger.tags = ['Books']
     #swagger.summary = 'Delete a book'
     #swagger.description = 'Permanently removes a book from the database using their unique ID.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the book to delete',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Book deleted successfully. Returns an empty response body.' 
     }
     #swagger.responses[404] = { 
        description: 'Book not found. No deletion was performed.' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while attempting to delete the book' 
     }
  */
  try {
    const result = await Book.deleteBook(req.params.id);
    if (result.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ error: 'Book not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while deleting the book.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createBook,
  updateBook,
  deleteBook
};