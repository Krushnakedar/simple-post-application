import { compare, hash } from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

dotenv.config();
const JWT_SECRET = "mysecret" || process.env.JWT_SECRET;

export function renderRegisterForm(req, res) {
  res.render("users/register.ejs");
}

export async function register(req, res) {
  let { username, email, password, city, category } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash("failure", "user already exists");
      // return res
      //   .status(StatusCodes.CONFLICT)
      //   .json({ message: "User already exists" });

      return res.redirect("/register");
    }

    const hashPassword = await hash(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      city: city,
      category: category,
    });

    await newUser.save();
    // res.status(StatusCodes.CREATED).json({ message: "User Registered" });
    console.log(newUser);
    req.flash("success", "user registered successfully");
    // res.render("users/login.ejs");
    res.redirect("/posts");
  } catch (e) {
    console.log(e);

    res.json({ message: `Something went wrong{e}` });
  }
}
export async function renderLoginForm(req, res) {
  res.render("users/login.ejs");
}
export async function login(req, res) {
  const { username, password } = req.body;
  console.log(process.env.JWT_SECRET);
  if (!username || !password) {
    console.log(username);
    console.log(password);
    req.flash("failure", "please provide both details");
    return res.redirect("/users/login");
    // return res.status(400).json({ message: "please provide" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.flash(
        "failure",
        "User does not exist, please registered new account"
      );
      return res.redirect("/register");
      // return res
      //   .status(StatusCodes.NOT_FOUND)
      //   .json({ message: "User Not found" });
    }
    const isMatch = await compare(password, user.password);

    if (isMatch) {
      let token = crypto.randomBytes(16).toString("hex");
      console.log(token);
      user.token = token;

      //jwt authentication
      req.session.userId = user._id;

      const jwtToken = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      user.token = jwtToken;

      await user.save();
      req.session.userId = user._id;

      res.cookie("jwt", jwtToken, { httpOnly: true, maxAge: 3600000 });
      req.session.jwt = jwtToken;
      req.flash("success", "user login successfully");

      return res.redirect("/posts");
      // res.render("posts/desktop.ejs");
      // return res.status(StatusCodes.OK).json({ token: token });
    } else {
      req.flash("failure", "Invalid Password");
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Something went wrong ${error}` });
  }
}
export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect("/posts"); // fallback
    }

    res.clearCookie("jwt");
    // Pass a query param to login page
    res.redirect("/login?logout=success");
  });
}
