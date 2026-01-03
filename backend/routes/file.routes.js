const express = require("express");
const router = express.Router();
const { getSasUrl } = require("../controllers/file.controller");

router.get("/sas", getSasUrl);

module.exports = router;