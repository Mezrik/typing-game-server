import { v4 as uuidv4 } from "uuid";

class Room {
  private _roomID: string;
  private _socketsConnected: SocketIO.Socket[] = [];
  private _scores: { [key: string]: number } = {};

  constructor() {
    this._roomID = uuidv4();
  }

  get id() {
    return this._roomID;
  }

  get playersCount() {
    return this._socketsConnected.length;
  }

  get scores() {
    return this._scores;
  }

  public join(socket: SocketIO.Socket) {
    socket.join(this._roomID);
    this._socketsConnected.push(socket);
    this._scores[socket.id] = 0;
  }

  public leave(socketID: string) {
    const i = this._socketsConnected.findIndex(
      (socket) => socket.id === socketID
    );
    if (i >= 0) this._socketsConnected.splice(i, 1);

    return this._socketsConnected.length === 0;
  }

  public updateScore(socket: SocketIO.Socket, score: number) {
    this._scores[socket.id] = score;
  }
}

export default Room;
