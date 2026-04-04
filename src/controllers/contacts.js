const User = require('../models/contact');

const getAll = async (req, res) => {
  /* #swagger.tags = ['Library Users']
     #swagger.summary = 'Get all library users'
     #swagger.description = 'Retrieves a list of all library users registered in the database.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.responses[200] = { 
        description: 'A list of library users retrieved successfully',
        schema: [{ 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com', 
            $membershipType: 'standart',
            $phone: '555-0199',
            $joinDate: '2026-04-03',
            $birthday: '1995-08-24'
        }]
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the user list' 
     }
  */
  try {
    const users = await User.getAllUsers();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving library users.' });
  }
};

const getSingle = async (req, res) => {
  /* #swagger.tags = ['Library Users']
     #swagger.summary = 'Get a single library user by ID'
     #swagger.description = 'Returns a specific user from the database using their unique MongoDB ObjectId.'
     
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the library user',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'User found and retrieved successfully',
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com', 
            $membershipType: 'standart',
            $phone: '555-0199',
            $joinDate: '2026-04-03',
            $birthday: '1995-08-24'
        }
     }
     #swagger.responses[404] = { 
        description: 'User not found in the database' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving user' 
     }
  */
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Library user not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving library user.' });
  }
};

const createContact = async (req, res) => {
  /* #swagger.tags = ['Library Users']
     #swagger.summary = 'Create a new library user'
     #swagger.description = 'Creates a new contact after validating first name, last name, email, and membership type.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'New user information',
        required: true,
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com', 
            $membershipType: 'standart',
            $phone: '555-0199',
            $joinDate: '2026-04-03',
            $birthday: '1995-08-24'
        }
    }

    #swagger.responses[201] = { 
        description: 'User created successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const { firstName, lastName, email, membershipType, phone, joinDate, birthday } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ error: 'firstName is required and must be a non-empty string.' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ error: 'lastName is required and must be a non-empty string.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!membershipType || typeof membershipType !== 'string' || membershipType.trim() === '') {
    return res.status(400).json({ error: 'membershipType is required (e.g. standard, premium, student).' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return res.status(400).json({ error: 'phone is required and must be a non-empty string.' });
  }
  if (!joinDate || typeof joinDate !== 'string' || joinDate.trim() === '') {
    return res.status(400).json({ error: 'joinDate is required and must be a non-empty string.' });
  }
  if (!birthday || typeof birthday !== 'string' || birthday.trim() === '') {
    return res.status(400).json({ error: 'birthday is required and must be a non-empty string.' });
  }

  try {
    const user = { firstName, lastName, email, membershipType, phone, joinDate, birthday };
    const result = await User.createUser(user);
    if (result.insertedId) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the library user.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while creating the library user.' });
  }
};

const updateContact = async (req, res) => {
  /* #swagger.tags = ['Library Users']
     #swagger.summary = 'Update a library user'
     #swagger.description = 'Updates an user after validating first name, last name, email, and membership type.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update user information',
        required: true,
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com', 
            $membershipType: 'standart',
            $phone: '555-0199',
            $joinDate: '2026-04-03',
            $birthday: '1995-08-24'
        }
    }

    #swagger.responses[204] = { 
        description: 'User updated successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const { firstName, lastName, email, membershipType, phone, joinDate, birthday } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ error: 'firstName is required and must be a non-empty string.' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ error: 'lastName is required and must be a non-empty string.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!membershipType || typeof membershipType !== 'string' || membershipType.trim() === '') {
    return res.status(400).json({ error: 'membershipType is required (e.g. standard, premium, student).' });
  }
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return res.status(400).json({ error: 'phone is required and must be a non-empty string.' });
  }
  if (!joinDate || typeof joinDate !== 'string' || joinDate.trim() === '') {
    return res.status(400).json({ error: 'joinDate is required and must be a non-empty string.' });
  }
  if (!birthday || typeof birthday !== 'string' || birthday.trim() === '') {
    return res.status(400).json({ error: 'birthday is required and must be a non-empty string.' });
  }

  try {
    const user = { firstName, lastName, email, membershipType, phone, joinDate, birthday };
    const result = await User.updateUser(req.params.id, user);
    if (result.matchedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Library user not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while updating the library user.' });
  }
};

const deleteContact = async (req, res) => {
  /* #swagger.tags = ['Library Users']
     #swagger.summary = 'Delete a library user'
     #swagger.description = 'Permanently removes a library user from the database using their unique ID.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the user to delete',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'User deleted successfully. Returns an empty response body.' 
     }
     #swagger.responses[404] = { 
        description: 'User not found. No deletion was performed.' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while attempting to delete the user' 
     }
  */
  try {
    const result = await User.deleteUser(req.params.id);
    if (result.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ error: 'Library user not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while deleting the library user.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact
};