const Staff = require('../models/staff');

const getAll = async (req, res) => {
  //#swagger.tags=['Library Staff']
  try {
    const staff = await Staff.getAllStaff();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Error retrieving library staff.' });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['Library Staff']
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
  //#swagger.tags=['Library Staff']
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
  //#swagger.tags=['Library Staff']
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
  //#swagger.tags=['Library Staff']
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