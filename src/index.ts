import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import socketIO from "socket.io";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

if (!process.env.PORT) {
  console.error("Define a port for the server to run on.");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/", (req, res) =>
  res.send({
    version: "1.0.0",
    message: "Realtime websocket server",
  })
);

const io = socketIO(server);

io.on("connect", (socket) => {
  let roomID: string;
  if (!socket.handshake.query.roomID) {
    roomID = uuidv4();
  } else {
    roomID = socket.handshake.query.roomID;
  }
  socket.join(roomID);

  socket.emit("initial", { roomID });

  io.to(roomID).emit("test", `Hello room ${roomID}`);
});
