import express from "express";
import { env } from "./config";
import { mainRouter } from "./routes";
import { Database } from "./db";
import cors from "cors";
const { Server } = require("socket.io");
import http from "node:http";
import { ChatService } from "./services/chat.service";

const app = express();
const server = http.createServer(app);
const databse = new Database();

databse.connect();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", mainRouter);
app.use("/uploads", express.static("uploads"));

const io = new Server(server, {
  cors: "*",
});
let users = {};

const chatService = new ChatService();

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    users[userId] = socket.id;
  });

  socket.on(
    "private message",
    async ({ senderId, receiverId, message, businessId }) => {
      const receiverSocketId = users[receiverId];
      await chatService.create([
        { senderId, recieverId: receiverId, message, businessId },
      ]);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("private message", { senderId, message });
        console.log(
          `Message sent from ${senderId} to ${receiverId}: ${message}`
        );
      } else {
        console.log(`User ${receiverId} is not connected.`);
      }
    }
  );

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const port = env.PORT;
server.listen(port, () => {
  console.log(`APP listening at port`, port);
});
