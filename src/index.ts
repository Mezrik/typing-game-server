import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import socketIO from "socket.io";
import Room from "./core/Room";

dotenv.config();

const PLAYERS_COUNT = 2;

if (!process.env.PORT) {
  console.error("Define a port for the server to run on.");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

export const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/", (req, res) =>
  res.send({
    version: "1.0.0",
    message: "Realtime websocket server",
  })
);

export const io = socketIO(server);

const rooms: { [key: string]: Room } = {};

const createRoom = (): Room => {
  const room = new Room();
  rooms[room.id] = room;

  return room;
};

io.on("connect", (socket) => {
  let room: Room;
  if (!socket.handshake.query.roomID) {
    room = createRoom();
    console.log(`Room ${room.id} created.`);
    socket.emit("room-created", room.id);
  } else {
    room = rooms[socket.handshake.query.roomID];
    if (!room) {
      socket.emit("room-not-found");
      return;
    }
  }

  room.join(socket);
  if (room.playersCount == PLAYERS_COUNT)
    io.to(room.id).emit("players-connected", room.id);

  socket.on("disconnect", () => {
    const isEmpty = room.leave(socket.id);

    if (isEmpty) {
      delete rooms[room.id];
      console.log(`Room ${room.id} deleted.`);
    }
  });

  socket.on("new-score", (score: number) => {
    room.updateScore(socket, score);
    io.to(room.id).emit("score-change", room.scores);
  });
});
