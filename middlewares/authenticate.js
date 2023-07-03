const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { handleHttpError } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(handleHttpError(401));
  }

  try {
    const { id, uid} = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    const session = await Session.findById(uid); // find session by id

    if (!user || !user.token || user.token !== token || !session || !session.userId) {
      next(handleHttpError(401));
    } // check if user exists and if token is valid and if session exists and if session.userId exists

    req.user = user;
    next();
  } catch (error) {
    next(handleHttpError(401));
  }
};

module.exports = authenticate;