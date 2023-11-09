const {
  createPayment,
  test
} = require("../controllers/payController");

const router = require("express").Router();

router.post("/createPayment", createPayment);
router.get("/test", test);

module.exports = router;
