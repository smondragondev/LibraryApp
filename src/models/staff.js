const mongodb = require('../config/db.config');
const ObjectId = require('mongodb').ObjectId;

const getAllStaff = async () => {
  const result = await mongodb.getDatabase().collection('staff').find();
  return result.toArray();
};

const getStaffById = async (id) => {
  const staffId = new ObjectId(id);
  const result = await mongodb.getDatabase().collection('staff').find({ _id: staffId });
  const books = await result.toArray();
  return books[0];
};

const createStaffMember = async (staff) => {
  return await mongodb.getDatabase().collection('staff').insertOne(staff);
};

const updateStaffMember = async (id, staff) => {
  const staffId = new ObjectId(id);
  return await mongodb.getDatabase().collection('staff').replaceOne(
    { _id: staffId },
    staff
  );
};

const deleteStaffMember = async (id) => {
  const bookId = new ObjectId(id);
  return await mongodb.getDatabase().collection('staff').deleteOne({ _id: bookId });
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember
};