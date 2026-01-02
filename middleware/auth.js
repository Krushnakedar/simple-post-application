import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(req, res, next) {
  //   let token = req.headers.authorization || req.cookies?.jwt || req.session?.jwt;
  //   console.log(req.cookies.jwt);
  let token = req.session.jwt;
  //   console.log("hello\n");
  //   console.log(token);
  console.log("JWT token from session:", token);

  if (!token) {
    req.flash("failure", "You must be logged in first");
    return res.redirect("/login");
  }
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.flash("failure", "Please enter valid credentials");
      return res.redirect("/login");
    }
    req.user = decoded;
    next();
  });
}
