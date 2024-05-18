import jwt from "jsonwebtoken";

export const middlewareToken = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) throw new Error("Token is invalid");
        req.user = user;
        next();
      });
    } else throw new Error("You are not authenticated");
  },
  verifyTokenAdminAuth: (req, res, next) => {
    middlewareToken.verifyToken(req, res, () => {
      if (req.user.id === req.params.id) {
        next();
      } else if (req.user.admin === true) {
        return next();
      } else throw new Error("You are not permission");
    });
  },
};
