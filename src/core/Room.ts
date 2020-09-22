import { v4 as uuidv4 } from "uuid";

class Room {
  private _roomID: string;
  private _socketsConnected: SocketIO.Socket[] = [];

  constructor() {
    this._roomID = uuidv4();
  }

  get id() {
    return this._roomID;
  }

  public join(socket: SocketIO.Socket) {
    socket.join(this._roomID);
    this._socketsConnected.push(socket);
  }

  public leave(socketID: string) {
    const i = this._socketsConnected.findIndex(
      (socket) => socket.id === socketID
    );
    if (i >= 0) this._socketsConnected.splice(i, 1);

    return this._socketsConnected.length === 0;
  }
}

export default Room;
