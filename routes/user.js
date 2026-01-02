import { Router } from "express";

import {
  login,
  logout,
  register,
  renderLoginForm,
  renderRegisterForm,
} from "../controllers/users.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("users/home");
});

router.route("/register").get(renderRegisterForm).post(register);

router.route("/login").get(renderLoginForm).post(login);
router.route("/logout").post(logout);
export default router;
