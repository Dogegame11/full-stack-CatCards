const Role = require("../models/Role");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateAccessToken = (id, roles) => {
  const payload = { id, roles };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Помилка валідації", errors });
      }

      const { username, email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Користувач з таким email вже існує" });
      }

      const hashPass = await bcrypt.hash(password, 10);
      let userRole = await Role.findOne({ value: "USER" });

      if (!userRole) {
        userRole = new Role({ value: "USER" });
        await userRole.save();
      }

      const user = new User({
        username,
        email,
        password: hashPass,
        roles: [userRole.value],
      });

      await user.save();
      return res.json({ message: "Реєстрація успішна!" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Помилка сервера при реєстрації" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Користувача не знайдено" });
      }

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).json({ message: "Невірний пароль" });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Помилка сервера при вході" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ message: "Помилка сервера при отриманні користувачів" });
    }
  }
}

module.exports = new AuthController();
