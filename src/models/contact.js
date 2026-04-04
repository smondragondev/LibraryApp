const mongodb = require('../config/db.config');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async () => {
  const result = await mongodb.getDatabase().collection('contacts').find();
  return result.toArray();
};

const getUserById = async (id) => {
  const userId = new ObjectId(id);
  const result = await mongodb.getDatabase().collection('contacts').find({ _id: userId });
  const contacts = await result.toArray();
  return contacts[0];
};

const createUser = async (user) => {
  return await mongodb.getDatabase().collection('contacts').insertOne(user);
};

const updateUser = async (id, user) => {
  const userId = new ObjectId(id);
  return await mongodb.getDatabase().collection('contacts').replaceOne(
    { _id: userId },
    user
  );
};

const deleteUser = async (id) => {
  const userId = new ObjectId(id);
  return await mongodb.getDatabase().collection('contacts').deleteOne({ _id: userId });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};