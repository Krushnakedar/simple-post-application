import User from "../models/user.js";

export async function isLoggedIn(req, res, next) {
  if (!req.session.userId) {
    req.flash("failure", "You must be logged in first");
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.userId);

  if (!user) {
    req.flash("failure", "Please login again");
    return res.redirect("/login");
  }

  req.user = user; // VERY IMPORTANT
  next();
}
