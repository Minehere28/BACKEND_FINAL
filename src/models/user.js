import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['Admin', 'Member'],
    default: 'Member',
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
}, { timestamps: true });

// ✅ Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  console.log('🔒 Hashing password...');
  try {
    this.password = await bcrypt.hash(this.password, 12);
    console.log('✅ Password hashed!');
    next();
  } catch (err) {
    console.error('❌ Error hashing password:', err);
    next(err);
  }
});

// ✅ So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (candidatePassword) {
  console.log('🔐 Comparing password...');
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('✅ Password comparison result:', result);
    return result;
  } catch (err) {
    console.error('❌ Error comparing password:', err);
    throw err;
  }
};

const User = mongoose.model('User', userSchema);
export default User;
