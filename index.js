import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

import route from "./routes/api.js";
import { connectingDB } from "./config/database.js";

const app = express();

await connectingDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/api", route);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
