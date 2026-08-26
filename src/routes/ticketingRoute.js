import express from "express";

const router = express.Router();

router.get("/hello", (req, res) => {
    res.json({message:"ticket counter on hello"});
});

export default router;