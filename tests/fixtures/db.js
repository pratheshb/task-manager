const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'testUser',
  email: 'test@example.com',
  password: 'Node@2020',
  tokens: [
    { token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }
  ]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'testUser2',
  email: 'test2@example.com',
  password: 'Node@2020',
  tokens: [
    { token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'First task',
  completed: false,
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'Second task',
  completed: true,
  owner: userOne._id
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'Third task',
  completed: false,
  owner: userTwo._id
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  
}


module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
  setUpDatabase
}