// index.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import warehouseRouter from "./routes/warehouse.js";
import inventoryRouter from "./routes/inventory.js";
import knex from 'knex';
import dbConfig from "./knexfile.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize knex with the database configuration.
const db = knex(dbConfig);

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/warehouse", warehouseRouter);
app.use("/inventory", inventoryRouter);

app.get("/", (req, res) => {
    res.status(200).send("Testing Request Successful");
});

app.listen(PORT, () => {
    console.log(`🚀 💯 Server is running on port ${PORT}`);
    console.log("❌ 🛑 To kill the server use CTRL+C");
});