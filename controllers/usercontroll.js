const { User, Thought } = require('../models');

module.exports = {

  // GET ALL USERS
  async getUsers(req, res) {
    try {
      const users = await User
        .find()
        .populate('friends')
      res.json(users);
    } catch (err) {
      res.status(500).json(err)
      // console.log(err)
    }
  },

  // GET A USER
  async getUser(req, res) {
    try {
      const user = await User
        .findOne({ _id: req.params.id })
        .populate('friends')

      if (!user) {
        return res.status(404).json({message: 'No user with that id'})
      }

      res.json(user)
    } catch (err) {
      // console.log(err)
      res.status(500).json(err)
    }
  },

  // CREATE A USER
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  },

  // UPDATE A USER
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id},
        { $set: req.body },
        { new: true }
      )

      if (!user) {
        return res.status(404).json({ message: 'No user with that id'});
      }

      res.json(user)
    } catch (err) {
      // console.log(err)
      res.status(500).json(err)
    }
  },

  // DELETE A USER
  async deleteUser(req, res) {
    try {
      const user = await User.findOne()

      if (!user) {
        return res.status(404).json({message: 'No user with that id'})
      }

      // delete thoughts associated with the user
      const thoughtsArr = user.thoughts.map(thought => thought.toString())
      // console.log(thoughtsArr)
      thoughtsArr.forEach(async function (thoughtId) { 
        await Thought.findOneAndDelete({ _id: thoughtId}) 
      })

      await User.findOneAndDelete({ _id: user._id});

      res.json({message: `${user.username} has been deleted`})
    } catch (err) {
      // console.log(err)
      res.status(500).json(err)
    }
  },
