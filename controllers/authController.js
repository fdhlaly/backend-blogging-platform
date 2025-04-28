import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../Models/User.js";

import checkEmailValid from "../libraries/checkEmailValid.js";
import checkEmailExist from "../libraries/checkEmailExist.js";

const generateAccessToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username) {
        throw { code: 400, message: "USERNAME_IS_REQUIRED" };
      }

      if (!email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }

      const emailExist = await checkEmailExist(email);
      if (emailExist) {
        throw { code: 400, message: "EMAIL_ALREADY_EXIST" };
      }

      if (!checkEmailValid(email)) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }

      if (!password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      if (password.length < 6) {
        throw { code: 400, message: "PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      if (!user) {
        throw { code: 400, message: "USER_REGISTER_FAILED" };
      }

      let payload = { id: user.id };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(201).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        username: user.username,
        email: user.email,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
