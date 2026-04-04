const Staff = require('../models/staff');

const getAll = async (req, res) => {
  /* #swagger.tags = ['Staff']
     #swagger.summary = 'Get all library staff'
     #swagger.description = 'Retrieves a list of all library staff registered in the database.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.responses[200] = { 
        description: 'A list of library staff retrieved successfully',
        schema: [{ 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com',
            $role: 'admin',
            $dateBirth: '08-02-2000',
            $position: 'cashier',
            $startDay: '06-24-2025'
        }]
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving the staff list' 
     }
  */
  try {
    const staff = await Staff.getAllStaff();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving library staff.' });
  }
};

const getSingle = async (req, res) => {
  /* #swagger.tags = ['Staff']
     #swagger.summary = 'Get a single staff member by ID'
     #swagger.description = 'Returns a specific staff member from the database using their unique MongoDB ObjectId.'
     
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the staff member',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Staff member found and retrieved successfully',
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com',
            $role: 'admin',
            $dateBirth: '08-02-2000',
            $position: 'cashier',
            $startDay: '06-24-2025'
        }
     }
     #swagger.responses[404] = { 
        description: 'Staff member not found in the database' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while retrieving a staff member' 
     }
  */
  try {
    const staff = await Staff.getStaffById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Library staff not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving library staff.' });
  }
};

const createStaff = async (req, res) => {
  /* #swagger.tags = ['Staff']
     #swagger.summary = 'Create a new staff member'
     #swagger.description = 'Creates a new staff member after validating firstName, lastName, email, role, dateBirth, position, startDay.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'New staff information',
        required: true,
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com',
            $role: 'admin',
            $dateBirth: '08-02-2000',
            $position: 'cashier',
            $startDay: '06-24-2025'
        }
    }

    #swagger.responses[201] = { 
        description: 'Staff member created successfully',
        schema: { id: '65f9a1b2c3d4e5f6g7h8i9j0' }
    }
    #swagger.responses[400] = { 
        description: 'Validation error in the provided data' 
    }
    #swagger.responses[500] = { 
        description: 'Internal server error' 
    }
  */
  const { firstName, lastName, email, role, dateBirth, position, startDay } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ error: 'First name is required and must be a non-empty string.' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ error: 'Last Name is required and must be a non-empty string.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!role || typeof role !== 'string' || role.trim() === '') {
    return res.status(400).json({ error: 'role is required (e.g. admin, general).' });
  }
  if (!dateBirth || typeof dateBirth !== 'string' || dateBirth.trim() === '') {
    return res.status(400).json({ error: 'Date of birth is required and must be a non-empty string.' });
  }
  if (!position || typeof position !== 'string' || position.trim() === '') {
    return res.status(400).json({ error: 'Position is required (e.g. cashier, recepcionist).' });
  }
  if (!startDay|| typeof birthday !== 'string' || startDay.trim() === '') {
    return res.status(400).json({ error: 'Start day is required and must be a non-empty string.' });
  }

  try {
    const staff = { firstName, lastName, email, role, dateBirth, position, startDay };
    const result = await Staff.createStaffMember(staff);
    if (result.insertedId) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the library staff.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while creating the library staff.' });
  }
};

const updateStaff = async (req, res) => {
  /* #swagger.tags = ['Staff']
     #swagger.summary = 'Update a staff member'
     #swagger.description = 'Updates an staff member after validating firstName, lastName, email, role, dateBirth, position, startDay.'
     #swagger.security = [{ "github_auth": [] }]
    
     #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update staff member information',
        required: true,
        schema: { 
            $firstName: 'John', 
            $lastName: 'Doe', 
            $email: 'john.doe@example.com',
            $role: 'admin',
            $dateBirth: '08-02-2000',
            $position: 'cashier',
            $startDay: '06-24-2025'
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
  const { firstName, lastName, email, role, dateBirth, position, startDay } = req.body;

  if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
    return res.status(400).json({ error: 'First Name is required and must be a non-empty string.' });
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
    return res.status(400).json({ error: 'Last Name is required and must be a non-empty string.' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!role || typeof role !== 'string' || role.trim() === '') {
    return res.status(400).json({ error: 'role is required (e.g. admin, general).' });
  }
  if (!dateBirth || typeof dateBirth !== 'string' || dateBirth.trim() === '') {
    return res.status(400).json({ error: 'Date of birth is required and must be a non-empty string.' });
  }
  if (!position || typeof position !== 'string' || position.trim() === '') {
    return res.status(400).json({ error: 'Position is required (e.g. cashier, recepcionist).' });
  }
  if (!startDay|| typeof birthday !== 'string' || startDay.trim() === '') {
    return res.status(400).json({ error: 'Start day is required and must be a non-empty string.' });
  }

  try {
    const staff = { firstName, lastName, email, role, dateBirth, position, startDay };
    const result = await Staff.updateStaffMember(req.params.id, staff);
    if (result.matchedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Library staff not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while updating the library staff.' });
  }
};

const deleteStaff = async (req, res) => {
  /* #swagger.tags = ['Staff']
     #swagger.summary = 'Delete a staff member'
     #swagger.description = 'Permanently removes a staff member from the database using their unique ID.'
     #swagger.security = [{ "github_auth": [] }]

     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The unique ID of the staff member to delete',
        required: true,
        type: 'string'
     }

     #swagger.responses[200] = { 
        description: 'Staff member deleted successfully. Returns an empty response body.' 
     }
     #swagger.responses[404] = { 
        description: 'Staff member not found. No deletion was performed.' 
     }
     #swagger.responses[500] = { 
        description: 'Internal server error while attempting to delete the staff member' 
     }
  */
  try {
    const result = await Staff.deleteStaffMember(req.params.id);
    if (result.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(404).json({ error: 'Library staff not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || 'Some error occurred while deleting the library staff.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createStaff,
  updateStaff,
  deleteStaff
};