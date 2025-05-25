const mongoose = require('mongoose');

const subBoardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    enum: ['TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE', 'ARCHIVE'],
    default: 'TODO'
  },
  background: {
    type: String
  },
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SubBoard', subBoardSchema);