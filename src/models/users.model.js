import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar:{
    public_id:{
      type: String,
      required: true, },
    url:{
        type: String,
        required: true,
    }
  }
}, { timestamps: true });  

// Hash the password before saving it to the database
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Instance method to validate the user's password
// userSchema.methods.validatePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
