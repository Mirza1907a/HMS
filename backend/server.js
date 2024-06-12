require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

// Models
const Task = require("./models/taskModel");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Routes initialization
const userRoutes = require("./routes/userRoutes");
const staffRoutes = require("./routes/staffRoutes");
const roomRoutes = require("./routes/roomRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notiRoutes = require("./routes/notiRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const guestReqRoutes = require("./routes/guestRequestRoutes");
const wakeUpCallRoutes = require("./routes/wakeUpRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const analyticsRoutes = require("./routes/analyticRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const policyRoutes = require("./routes/policyRoutes");
const blogRoutes = require("./routes/blogRoutes");

const serviceRoutes = require("./routes/serviceRoutes");
const serviceCategoryRoutes = require("./routes/serviceCategoryRoutes");
const orderServiceRoutes = require("./routes/serviceOrderRoutes");
const {
  checkInBookings,
  checkOutBookings,
} = require("./utils/scheduleBookings");
const { scheduleWakeUpCalls } = require("./utils/scheduleWakeUpCalls");
// Sockets initialization

const staffSockets = {};
const userSockets = {};
const guestSockets = {};

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  req.staffSockets = staffSockets;
  req.userSockets = userSockets;
  req.guestSockets = guestSockets;
  console.log(req.path, req.method);
  next();
});

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/roomType", roomTypeRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/notis", notiRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/serviceCategory", serviceCategoryRoutes);
app.use("/api/orderService", orderServiceRoutes);
app.use("/api/guestReq", guestReqRoutes);
app.use("/api/wakeUp", wakeUpCallRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/blog", blogRoutes);

//send order summary

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    server.listen(process.env.PORT, () => {
      console.log("Listening to", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  io.emit("clientCount", io.engine.clientsCount);

  socket.on("register", ({ role, userId }) => {
    if (role === "staff") {
      staffSockets[userId] = socket.id;
      console.log("a user connected to staff", staffSockets);
    } else if (role === "user") {
      userSockets[userId] = socket.id;
      console.log("a user connected to user", userSockets);
    } else if (role === "guest") {
      guestSockets[userId] = socket.id;
      console.log("a user connected to guest", guestSockets);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in staffSockets) {
      if (staffSockets[userId] === socket.id) {
        delete staffSockets[userId];
        break;
      }
    }
    for (const userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
    for (const userId in guestSockets) {
      if (guestSockets[userId] === socket.id) {
        delete guestSockets[userId];
        break;
      }
    }
    io.emit("clientCount", io.engine.clientsCount);
  });
});

const createMockReq = () => {
  return {
    io,
    guestSockets,
    staffSockets,
    userSockets,
  };
};

//Schedule Tasks

cron.schedule("* * * * *", () => {
  const req = createMockReq();
  checkInBookings(req);
});

cron.schedule("* * * * *", () => {
  const req = createMockReq();
  checkOutBookings(req);
});

cron.schedule("* * * * * *", () => {
  const req = createMockReq();
  scheduleWakeUpCalls(req);
});

cron.schedule("* * * * * *", async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const expiredTasks = await Task.find({
      deadlineDate: { $lte: twoDaysAgo },
    });

    for (const task of expiredTasks) {
      await task.deleteOne();
      console.log(`Task deleted: ${task._id}`);
    }
  } catch (error) {
    console.error("Error deleting expired tasks:", error);
  }
});
