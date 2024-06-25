import express from 'express';
import "dotenv";
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);
const router = express.Router();

router.get("/", async (req,res) => {
    try{
        const data = await knex("warehouse");
        res.status(200).json(data);
    } catch (err){
        res.status(400).send(`Error in retrieving warehouse details: ${err}`)
    }
})

export default router;
