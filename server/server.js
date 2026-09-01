const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);



const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
require("dotenv").config();

const connectDB = require("./config/database");
const feedbackRoutes = require("./routes/feedbackRoutes");
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET loaded in server:", !!JWT_SECRET);

const app = express();

// Connect to MongoDB
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
     console.log("Database name:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });


// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);


    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
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

    // Create JWT token
    console.log("JWT_SECRET available during login:", !!process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "College Placement Portal API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    user: req.user
  });
});

// Create Student Profile
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

      // Check if profile already exists
      const existingProfile = await StudentProfile.findOne({
        userId: req.user.id
      });

      if (existingProfile) {
        return res.status(400).json({
          success: false,
          message: "Student profile already exists"
        });
      }

      // Create profile
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

      res.status(201).json({
        success: true,
        message: "Student profile created successfully",
        profile
      });

    } catch (error) {
      res.status(500).json({
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

// Company-only route
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

// Admin-only route
app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
      user: req.user
    });
  }
);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});