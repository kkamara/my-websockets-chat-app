'use strict';
const path = require('node:path');
const cookieParser = require('cookie-parser');
const sanitize = require('sanitize');
const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { notFound, jsonError, } = require('./middlewares/V1/errorMiddleware');
const { session } = require('./middlewares/V1/sessionMiddleware');
const { minifyHTML } = require('./middlewares/V1/minifyHTMLMiddleware');
const { requestLog } = require('./middlewares/V1/loggingMiddleware');
const { limiter } = require('./middlewares/V1/throttleMiddleware');
const { cors } = require('./middlewares/V1/corsMiddleware');

const app = express();

// For request logs when deployed on remote servers.
// If we don't do this, the logs show the remote address as "127.0.0.1".
if ("production" === config.nodeEnv) {
  app.enable("trust proxy");
}

app.use(limiter);
app.use(requestLog);

app.set('view engine', 'pug');
app.set('views', path.join(
  __dirname,
  'views',
));

app.use(express.static("public"));
app.use('/static', express.static("frontend/build/static"));
app.get('/*', express.static('frontend/build'));

if ('production' === config.nodeEnv) {
  app.use(minifyHTML);
}

app.use(session);
app.use(cookieParser(config.appKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(sanitize.middleware);
app.use(cors);

app.use('/', routes);

// Serve ReactJS app routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.use(notFound);
app.use(jsonError);

let server;
if ('production' === config.nodeEnv) {
  server = app.listen(config.appPort);
} else {
  server = app.listen(config.appPort, () => {
    const url = `http://127.0.0.1:${config.appPort}`;
    console.log(`Listening on ${url}`);
  });
}

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const socketStorage = {};

io.on("connection", socket => {
  console.log("Connected to socket.io");
  console.log("socketStorage", socketStorage);
  console.log("socket.id", socket.id);

  socket.on("setup", userData => {
    socketStorage[socket.id] = {
      userID: userData.id,
      rooms: [],
    };
    console.log("socketStorage after setup", socketStorage);
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", data => {
    if (!socketStorage[socket.id]) {
      socketStorage[socket.id] = {
        userID: data.userID,
        rooms: [],
      };
    }
    socketStorage[socket.id].rooms.push(data.chatID);
    socket.join(data.chatID);
    console.log("User Joined Room: " + data.chatID);
    console.log("socketStorage after join chat", socketStorage);
  });

  socket.on("new message", newMessageReceived => {
    var chat = newMessageReceived;

    if (!chat.to) {
      return console.log("chat.to not defined");
    }

    chat.to.forEach(to => {
      socket.in(to.userID).emit(
        "message received",
        newMessageReceived,
      );
    });
  });

  socket.on("typing", room => socket.in(room).emit("typing"));
  socket.on(
    "stop typing",
    room => socket.in(room).emit("stop typing")
  );

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    if (socketStorage[socket.id]) {
      if (socketStorage[socket.id].rooms) {
        for (const room of socketStorage[socket.id].rooms) {
          socket.leave(room);
        }
      }
      socket.leave(socketStorage[socket.id].userID);
      delete socketStorage[socket.id];
    }
    console.log("socketStorage after disconnect", socketStorage);
  });
});