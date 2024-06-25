import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';
import warehouse from "./routes/warehouse.js";
import inventory from "./routes/inventory.js";
import dbConfig from "./knexfile.js";
import knex from 'knex'; 

const app = express();

const PORT = process.env.PORT || 8080;

// Initialize knex with the database configuration.
const db = knex(dbConfig);

// All routes
app.use(cors()); 
app.use("/warehouse", warehouse);
app.use("/inventory", inventory);

app.get("/", (req, res) => {
    res.status(200).send("Testing Request Successful");
});

app.listen(PORT, () => {
    console.log(`Started the server on ${PORT}`);
    console.log("To kill the server use CTRL+C");
});
