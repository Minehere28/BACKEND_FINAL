import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, default: new Date().toISOString() },
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
