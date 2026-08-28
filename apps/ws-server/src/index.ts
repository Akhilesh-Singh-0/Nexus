import { WebSocketServer } from "ws";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (socket) => {
  console.log("client connected");

  socket.on("message", (data) => {
    console.log("received:", data.toString());
  });

  socket.on("close", () => {
    console.log("client disconnected");
  });
});

console.log(`ws-server listening on port ${PORT}`);
