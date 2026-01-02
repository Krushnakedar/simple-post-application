import flash from "connect-flash";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import { connect } from "mongoose";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import postRouter from "./routes/post.js";
import userRouter from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "/views"));
app.set("mongo_user");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

const connectionDb = await connect(
  "proccess.env.MONGO_URI"
);
console.log(`MONGO connected DB Host : ${connectionDb.connection.host}`);

// app.get("/", (req, res) => {
//   res.render("users/login");
// });
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  next();
});

app.use("/", userRouter);
app.use("/posts", postRouter);

app.listen(3000, () => {
  console.log("server running on port 3000");
});
