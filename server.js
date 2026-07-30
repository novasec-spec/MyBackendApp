require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const pool = require("./config/database");

const testRoutes = require("./routes/test");
const authRoutes = require("./routes/auth");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/test", testRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    app: "MyApp Backend",
    version: "1.0.0",
    status: "Running",
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected");

    app.listen(PORT, () => {
      console.log("======================");
      console.log("Server Running");
      console.log("Port:", PORT);
      console.log("======================");
    });
  } catch (err) {
    console.error("❌ Database connection failed");
    console.error(err);
    process.exit(1);
  }
})();
