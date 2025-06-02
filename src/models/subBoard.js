import mongoose from 'mongoose';

const subBoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    background: {
      type: String,
    },
  },
  { timestamps: true }
);

const SubBoard = mongoose.model('SubBoard', subBoardSchema);

export default SubBoard;
