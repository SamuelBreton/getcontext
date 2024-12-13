console.log(__dirname);
const express = require("express");
const { generateContext } = require("../controllers/contextController");
const router = express.Router();


router.get("/context", (req, res) => {
    const { timestamp } = req.query;
    const userAgent = req.headers["user-agent"] || "unknown";
    const context = generateContext(timestamp, userAgent);
  
    if (context.error) {
      return res.status(400).json(context);
    }
  
    res.json(context);
  });
  
  module.exports = router;