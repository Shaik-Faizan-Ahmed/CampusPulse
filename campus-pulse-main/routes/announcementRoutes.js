const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, authorize, requireOrgMember } = require("../middleware/authMiddleware");
const {
    getAnnouncements, createAnnouncement, deleteAnnouncement
} = require("../controllers/announcementController");

router.get("/", protect, requireOrgMember, getAnnouncements);
router.post("/", protect, requireOrgMember, authorize("admin", "coordinator"), createAnnouncement);
router.delete("/:id", protect, requireOrgMember, authorize("admin", "coordinator"), deleteAnnouncement);

module.exports = router;
