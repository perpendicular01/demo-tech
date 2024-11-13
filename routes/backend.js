const express = require("express");
const path = require("path");
const authenticationController = require("../controllers/authentication");
const fetchData = require("../controllers/fetchData");
const filters = require("../controllers/filters");
const comments = require("../controllers/comments");
const invoiceController = require("../controllers/invoiceController");
const promoController = require("../controllers/promoController");
const { scrapeStartech } = require("../controllers/scrapeMonitor");
const { scrapeTechland } = require("../controllers/scrapeMonitor");

const router = express.Router();

const rootDir = path.resolve(__dirname, "..");

router.post("/signUp", authenticationController.signUp);

router.post("/login", authenticationController.login);

router.post("/logout", authenticationController.logout);

router.post("/send-otp", authenticationController.sendOtp);

router.post("/verify-otp", authenticationController.verifyOtp);

router.post("/setNewPassword", authenticationController.setNewPassword);

router.post("/fetchMonitorData", fetchData.fetchMonitorData);

router.post("/fetchCPUData", fetchData.fetchCPUData);

router.post("/fetchGPUData", fetchData.fetchGPUData);

router.post("/fetchRAMData", fetchData.fetchRAMData);

router.post("/filterMonitor", filters.filterMonitor);

router.post("/filterGPU", filters.filterGPU);

router.post("/postComment", comments.postComment);

router.post("/fetchComments", comments.fetchComments);

router.post("/createInvoice", invoiceController.createInvoice);

router.post("/validatePromo", promoController.validatePromo);

module.exports = router;
