// hash password, xử lí logic (giao tiếp với repository) + func repository
// dùng crypto tạo hash password
import {createHash} from 'crypto';
import { UserRepository } from '../../repositories/users.repository.js'

const userRepo = new UserRepository();

const hashPassword = async(plainText) => {
  return createHash('sha256').update(plainText).digest('hex');
};

class AuthService {
  async register ({name, password}) {
    const hashedPassword = await hashPassword(password);
    console.log('Hashed password:', hashedPassword);

    const user = await userRepo.create({
      name,
      password: hashedPassword
    });
    return user;
  }

    async example(username, password) {
    const newUser = await userRepo.create({
      name: username,
      password: await hashPassword(password) // hash tại đây luôn
    });

    const allUsers = await userRepo.getAll();
    return allUsers;
  }
}

export default new AuthService();