require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/database");

// Routes
const authRoutes = require("./routes/auth.routes");
const kycRoutes = require("./routes/kyc.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const walletRoutes = require("./routes/wallet.routes");
const adminRoutes = require("./routes/admin.routes");
const sellerRoutes = require("./routes/seller.routes");
const supplierRoutes = require("./routes/supplier.routes");
const testRoutes = require("./routes/testRoutes");
const notificationRoutes = require("./routes/notification.routes");
const superAdminRoutes = require("./routes/superAdmin.routes");
const fileRoutes = require("./routes/file.routes");
const storeRoutes = require("./routes/store.routes");

// --------------------
// APP SETUP
// --------------------
const app = express();
connectDB();

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(
  cors({
    origin: "https:seller-final-12.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/files", fileRoutes);

// Routes
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller/stores", storeRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/test", testRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// --------------------
// HTTP SERVER + SOCKET
// --------------------
const PORT = process.env.PORT || 5000;

// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.VITE_API_URL,
    credentials: true,
  },
});

// 🔥 Socket connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// 🔥 Make io globally available
global.io = io;

// --------------------
// START SERVER
// --------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
