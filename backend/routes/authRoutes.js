const Router = require("express");
const router = new Router();

const controller = require("./authController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
  "/register",
  [
    check("username", "Ім'я користувача не може бути порожнім").notEmpty(),
    check("email", "Некоректний email").isEmail(),
    check("password", "Пароль повинен містити мінімум 5 символів").isLength({
      min: 5,
    }),
  ],
  controller.register
);

router.post("/login", controller.login);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  controller.getUsers
);

module.exports = router;
