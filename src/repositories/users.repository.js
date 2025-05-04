// import UserModel from '../models/users.model.js';

// export class UserRepository {
//   async create(dto) {
//     const { name, password } = dto;

//     const result = await UserModel.create({
//       name,
//       password
//     });

//     return {
//       name,
//       id: String(result._id),
//     };
//   }

//   async getAll() {
//     const users = await UserModel.find();

//     return users.map(user => ({
//       id: user._id.toString(),
//       name: user.name,
//     }));
//   }

//   // các hàm khác nếu cần
// }

import User from '../models/users.model.js';

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async updateResetToken(userId, token, expiresAt) {
    return User.findByIdAndUpdate(userId, {
      passwordResetToken: token,
      passwordResetExpires: expiresAt
    });
  }

  async findValidResetToken(userId, token) {
    return User.findOne({
      _id: userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
  }

  async updatePassword(userId, hashedPassword) {
    return User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });
  }

  async clearResetToken(userId) {
    return User.findByIdAndUpdate(userId, {
      passwordResetToken: undefined,
      passwordResetExpires: undefined
    });
  }
}

export default UserRepository;