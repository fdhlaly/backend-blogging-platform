import express from "express";

import authController from "../controllers/authController.js";

const route = express.Router();

route.post("/register", authController.register);

export default route;
