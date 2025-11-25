import cors from "cors";
import express from "express"; //server yaratish uchun framework.
import path from "path"; //fayl va papka yo‘llarini to‘g‘ri birlashtirish uchun.
import router from "./router"; //odatiy foydalanuvchi yo‘llari.
import routerAdmin from "./router-admin"; //admin panel yo‘llari.
import morgan from "morgan"; //HTTP log yozish kutubxonasi
import cookieParser from "cookie-parser"; //cookie’larni o‘qish.
import { MORGAN_FORMAT } from "./libs/config"; // log formatini belgilovchi sozlama.
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1-ENTRANCE **/

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads")); //Middleware
app.use(express.urlencoded({ extended: true })); //HTML form ma’lumotlarini o‘qish. Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/** 2-SESSIONS **/

app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, // 3h
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});
/** 3-VIEWS **/

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4-ROUTERS **/

app.use("/admin", routerAdmin); //Middleware Design Pattern & SPA-(EJS)
//single page applacation
app.use("/", router); //SPA:REACT

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let summaryClient = 0;
io.on("connection", (socket) => {
  summaryClient++;
  console.log(`Connection & total [${summaryClient}]`);

  socket.on("disconnect", () => {
    summaryClient--;
    console.log(`Disconnection & total [${summaryClient}]`);
  });
});

export default server;
