const express = require("express");
const path = require("path");
const scrapeMonitor = require("../controllers/scrapeMonitor");
const scrapeCPU = require("../controllers/scrapeCPU");
const scrapGPU = require("../controllers/scrapeGPU");
const scrapeRAM = require("../controllers/scrapeRAM");

const router = express.Router();

const rootDir = path.resolve(__dirname, "../frontend/sources");

router.get("/", async (req, res) => {
  res.sendFile(path.join(rootDir, "home.html"));
  try {
   // await scrapeMonitor.scrapeStartech();
    //await scrapeRAM.scrapeStartech();
    // await scrapGPU.scrapeStartech();
    //await scrapeCPU.scrapeStartech();
    // //await scrapeMonitor.scrapeTechland();
    // //await scrapGPU.scrapeTechland();
    // await scrapeMonitor.scrapePcHouse();
    //await scrapGPU.scrapePcHouse();
  } catch (error) {
    console.log("Error in ssscsraping");
  }
  // Pass the username to the template if the user is authenticated
});

router.get("/login", (req, res) => {
  if (!req.session.authorized) res.sendFile(path.join(rootDir, "login.html"));
  else res.sendFile(path.join(rootDir, "home.html"));
});

router.get("/signup", (req, res) => {
  if (!req.session.authorized) res.sendFile(path.join(rootDir, "signup.html"));
  else res.sendFile(path.join(rootDir, "home.html"));
});

router.get("/profile", (req, res) => {
  res.sendFile(path.join(rootDir, "profile.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(rootDir, "about.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(rootDir, "contact.html"));
});

router.get("/monitor", (req, res) => {
  res.sendFile(path.join(rootDir, "product.html"));
});

router.get("/gpu", (req, res) => {
  res.sendFile(path.join(rootDir, "gpu.html"));
});

router.get("/cpu", (req, res) => {
  res.sendFile(path.join(rootDir, "cpu.html"));
});

router.get("/ram", (req, res) => {
  res.sendFile(path.join(rootDir, "ram.html"));
});

router.get("/cart", (req, res) => {
  res.sendFile(path.join(rootDir, "cart.html"));
});

router.get("/monitorDetails", (req, res) => {
  res.sendFile(path.join(rootDir, "monitorDetails.html"));
});

router.get("/gpuDetails", (req, res) => {
  res.sendFile(path.join(rootDir, "gpuDetails.html"));
});

router.get("/monitorCompare", (req, res) => {
  res.sendFile(path.join(rootDir, "monitorCompare.html"));
});

router.get("/gpuCompare", (req, res) => {
  res.sendFile(path.join(rootDir, "gpuCompare.html"));
});

module.exports = router;
