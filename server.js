const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

require("./connection");

const server = require("https").createServer(app);
const PORT = 8080;
const io = require("socket.io")(server, {
  cors: {
    origin: "https://www.ciriverse.xyz",
    methods: ["GET", "POST"],
  },
});

// socket connection
io.on("connection", (socket) => {
  console.log("Connected", socket.id);
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (newRoom) => {
    socket.join(newRoom.toLowerCase());
    // socket.leave(previousRoom.toLowerCase());
    // let roomMessages = await getLastMessagesFromRoom(newRoom);
    // roomMessages = sortRoomMessagesByDate(roomMessages);
    // socket.emit("room-messages", roomMessages);
  });

  socket.on("sending-donate", async (address, messages) => {
    console.log("ada yang kirim nih", messages);
    console.log(`ke room ${address.toLowerCase()}`);
    io.to(address.toLowerCase()).emit("receive-donate", messages);
    // let roomMessages = await getLastMessagesFromRoom(newRoom);
    // roomMessages = sortRoomMessagesByDate(roomMessages);
    // socket.emit("room-messages", roomMessages);
  });

  socket.on("sending-nft", async (address, messages) => {
    console.log("ada yang mint nft", messages);
    console.log(`ke room ${address.toLowerCase()}`);
    io.to(address.toLowerCase()).emit("receive-nft", messages);
    // let roomMessages = await getLastMessagesFromRoom(newRoom);
    // roomMessages = sortRoomMessagesByDate(roomMessages);
    // socket.emit("room-messages", roomMessages);
  });
});

server.listen(PORT, () => {
  console.log("listening to port", PORT);
});
