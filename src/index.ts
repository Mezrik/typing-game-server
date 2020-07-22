import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";

dotenv.config();

if (!process.env.PORT) {
  console.error("Define a port for the server to run on.");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/", (req, res) => res.send("Hello world!"));