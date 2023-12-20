const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { purchase_premium, update_order } = require("../controllers/purchase");

const router = express.Router();


router.get("/purchase-premium",authenticate,purchase_premium)
router.put("/update-order", authenticate, update_order);



module.exports = router;
