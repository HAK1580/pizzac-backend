const express = require("express");
const app = express();
const cors = require("cors");
const fooditemRoutes = require("./routes/fooditemRoute");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoutes");

// 1. Use uppercase process.env.PORT with fallback for local dev
const PORT = process.env.PORT || 3000;

connectdb();

// 2. Configure CORS Options
const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "http://localhost:3000", // React local dev (if using CRA)
  process.env.CLIENT_URL,  // Your live deployed frontend URL (e.g. https://your-app.vercel.app)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable if sending cookies or auth headers
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/food", fooditemRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("Server is running healthy");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});