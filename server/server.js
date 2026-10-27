
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const feedbackRoutes = require("./routes/feedbackRoutes");
const companyRoutes = require("./routes/companyRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET loaded:", Boolean(JWT_SECRET));

// Middleware
app.use(cors());
app.use(express.json());

// Existing routes
app.use("/api/feedback", feedbackRoutes);

// IMPORTANT: Company profile routes
app.use("/api/company/profile", companyRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "College Placement Portal API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
    databaseConnected: mongoose.connection.readyState === 1
  });
});

// Register user
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required"
      });
    }

    if (!["student", "company"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role"
      });
    }

    const existingUser = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login user
app.post("/api/login", async (req, res) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in server .env"
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    user: req.user
  });
});

// Create student profile
app.post(
  "/api/student/profile",
  authMiddleware,
  roleMiddleware("student"),
  async (req, res) => {
    try {
      const {
        rollNumber,
        branch,
        section,
        phone,
        cgpa,
        graduationYear,
        skills,
        resume
      } = req.body;

      const existingProfile = await StudentProfile.findOne({
        userId: req.user.id
      });

      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "Student profile already exists"
        });
      }

      const profile = await StudentProfile.create({
        userId: req.user.id,
        rollNumber,
        branch,
        section,
        phone,
        cgpa,
        graduationYear,
        skills,
        resume
      });

      return res.status(201).json({
        success: true,
        message: "Student profile created successfully",
        profile
      });
    } catch (error) {
      console.error("Student profile error:", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Student-only route
app.get(
  "/api/student",
  authMiddleware,
  roleMiddleware("student"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Student Dashboard",
      user: req.user
    });
  }
);

// Company dashboard route
app.get(
  "/api/company",
  authMiddleware,
  roleMiddleware("company"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Company Dashboard",
      user: req.user
    });
  }
);

// Admin: Get all students
app.get(
  "/api/admin/students",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const students = await User.find(
        { role: "student" },
        "-password"
      ).sort({ createdAt: -1 });

      return res.json({
        success: true,
        students
      });
    } catch (error) {
      console.error("Admin students error:", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Admin: MongoDB connection test
app.get(
  "/api/admin/test",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          message: "MongoDB is not connected"
        });
      }

      return res.json({
        success: true,
        message: "Admin is connected to MongoDB successfully",
        database: mongoose.connection.name,
        user: req.user
      });
    } catch (error) {
      console.error("Admin test error:", error.message);

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Start server after MongoDB connects
async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in server .env");
    process.exit(1);
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is missing in server .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
    console.log("Database name:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
