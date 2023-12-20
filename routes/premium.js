const express = require("express");
const { fetch_leaderboard } = require("../controllers/premium");
const { authenticate } = require("../middlewares/auth");


const router = express.Router();



router.get("/fetch-leaderboard", authenticate,fetch_leaderboard);

module.exports = router;
