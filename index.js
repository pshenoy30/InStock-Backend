import express from 'express';
import 'dotenv';
import cors from 'cors';
import warehouse from "./routes/warehouse.js";
import inventory from "./routes/inventory.js";

const app = express();

const PORT = process.env.PORT||8080;

app.use("/warehouse", warehouse);
app.use("/inventory", inventory);

app.get("/", (req,res)=>{
    res.status(200).send("Testing Resquest Successful")
})

app.listen(PORT, () => {
    console.log("Started the server on ",PORT);
    console.log("To kill the server use CTRL+C");
})