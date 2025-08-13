require("dotenv").config(); // To use environment variables
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_secret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour session
    })
);

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// MySQL Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Root@123",
    database: process.env.DB_NAME || "library_management",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(uploadDir));

// --- ROUTES ---

// User Login
app.post("/login", (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ success: false, message: "UserId and password are required." });
    }

    const query = "SELECT * FROM users WHERE userId = ? AND password = ?";
    db.query(query, [userId, password], (err, results) => {
        if (err) {
            console.error("Login Query Error:", err.message);
            return res.status(500).json({ success: false, message: "Database error." });
        }

        if (results.length > 0) {
            req.session.user = { userId, role: results[0].role }; // Store user session
            res.json({ success: true, role: results[0].role });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    });
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err.message);
            return res.status(500).json({ success: false, message: "Failed to logout." });
        }
        res.json({ success: true, message: "Logged out successfully." });
    });
});

// Add New User
app.post("/add-user", upload.single("proof"), (req, res) => {
    const { userId, password, role, phone, email } = req.body;

    if (!req.file) {
        return res.status(400).json({ success: false, message: "Proof file is required" });
    }

    const proofPath = `uploads/${req.file.filename}`;

    const query = `
        INSERT INTO users (userId, password, role, phone, email, proof_path) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, password, role, phone, email, proofPath], (err, result) => {
        if (err) {
            console.error("Database Insertion Error:", err.message);
            return res.status(500).json({ success: false, message: "Failed to add user to the database." });
        }

        res.status(201).json({ success: true, message: "User created successfully." });
    });
});

// Fetch all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Fetch Books Error:", err.message);
            return res.status(500).json({ success: false, message: "Failed to fetch books." });
        }
        res.json({ success: true, data: results });
    });
});

// Fetch all users
app.get("/users", (req, res) => {
    const query = "SELECT userId, role, phone, email, proof_path FROM users WHERE role = 'user'";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Fetch Users Error:", err.message);
            return res.status(500).json({ success: false, message: "Failed to fetch users." });
        }
        res.json({ success: true, data: results });
    });
});



// --- ERROR HANDLING ---

// 404 Handling
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found." });
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ success: false, message: "Internal server error." });
});

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("Closing database pool...");
    db.end((err) => {
        if (err) console.error("Error closing the database pool:", err.message);
        console.log("Database pool closed.");
        process.exit(0);
    });
});

// --- START SERVER ---
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
