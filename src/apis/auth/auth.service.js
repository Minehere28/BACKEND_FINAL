// // hash password, xử lí logic (giao tiếp với repository) + func repository
// // dùng crypto tạo hash password
// import {createHash} from 'crypto';
// import { UserRepository } from '../../repositories/users.repository.js'

// const userRepo = new UserRepository();

// const hashPassword = async(plainText) => {
//   return createHash('sha256').update(plainText).digest('hex');
// };

// class AuthService {
//   async register ({name, password}) {
//     const hashedPassword = await hashPassword(password);
//     console.log('Hashed password:', hashedPassword);

//     const user = await userRepo.create({
//       name,
//       password: hashedPassword
//     });
//     return user;
//   }

//     async example(username, password) {
//     const newUser = await userRepo.create({
//       name: username,
//       password: await hashPassword(password) // hash tại đây luôn
//     });

//     const allUsers = await userRepo.getAll();
//     return allUsers;
//   }
// }

// export default new AuthService();

import UserRepository from '../../repositories/users.repository.js'
import MailService from '../../services/mail.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const RESET_TOKEN_EXPIRY = 3600; // 1 giờ

class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.mailService = MailService;
  }

  async sendPasswordResetEmail(email) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) return; // Không báo lỗi để tránh leak thông tin

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: RESET_TOKEN_EXPIRY }
    );

    await this.userRepo.updateResetToken(
      user._id, 
      token,
      Date.now() + RESET_TOKEN_EXPIRY * 1000
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailService.sendResetPasswordEmail(email, resetUrl);
  }

  async resetPassword(token, newPassword) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await this.userRepo.findValidResetToken(
      decoded.id, 
      token
    );

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePassword(user._id, hashedPassword);
    await this.userRepo.clearResetToken(user._id);

    await this.mailService.sendPasswordChangedConfirmation(user.email);
  }
}

export default new AuthService();