import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const generateToken = (user) => {
  return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
