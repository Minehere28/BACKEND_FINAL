// đoán request trả về reponse, username + password (req) ==> tiếp tục đi sâu vào những lớp tiếp theo
import AuthService from './auth.service.js';

class AuthController {
  async register(req, res) {
    try {
      const { name, password } = req.body;

      const user = await AuthService.register({ name, password });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async example(req, res) {
    try {
      const { name, password } = req.body;

      const result = await AuthService.example(name, password);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new AuthController();
