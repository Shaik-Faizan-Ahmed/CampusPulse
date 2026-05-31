const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorize, requireOrgMember } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");

router.get("/", protect, requireOrgMember, authorize("admin"), getAnalytics);

module.exports = router;
