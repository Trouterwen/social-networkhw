const { Thought } = require('../models');
const { User } = require('../models');

module.exports = {

  // GETS ALL THOUGHTS
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought
        .find()
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err)
     
    }
  },

  // GETS A THOUGHT
  async getThought(req, res) {
    try {
      const thought = await Thought
        .findOne({ _id: req.params.id })

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json(thought)
    } catch (err) {
      
      res.status(500).json(err)
    }
  },

  // CREATES A THOUGHT
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { username: req.body.username},
        { $push: { thoughts: thought._id}}
      )
      res.json(thought)
    } catch (err) {
    
      res.status(500).json(err)
    }
  },

  // UPDATES A THOUGHT
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id},
        { $set: req.body },
        { new: true }
      )

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that id'});
      }

      res.json(thought)
    } catch (err) {
     
      res.status(500).json(err)
    }
  },

  // UPDATES A THOUGHT
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.id});

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json({message: `${thought.username}'s thought has been deleted`})
    } catch (err) {
     
      res.status(500).json(err)
    }
  },

  // ADDS A REACTION
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $push: { reactions: req.body}}
      )

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json(req.body)
  } catch (err) {
    
    res.status(500).json(err)
  }
  },

  // DELETES A REACTION
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: { reactionId: req.params.reactionId}}}
      )

      if (!thought) {
        return res.status(404).json({message: 'No thought with that id'})
      }

      res.json({ message: 'The reaction has been removed'})
  } catch (err) {
    
    res.status(500).json(err)
  }
  }
}