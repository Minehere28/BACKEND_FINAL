import UserModel from '../models/users.model.js';

export class UserRepository {
  async create(dto) {
    const { name, password } = dto;

    const result = await UserModel.create({
      name,
      password
    });

    return {
      name,
      id: String(result._id),
    };
  }

  async getAll() {
    const users = await UserModel.find();

    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
    }));
  }

  // các hàm khác nếu cần
}
