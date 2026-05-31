const Announcement = require("../models/Announcement");
const Event = require("../models/Event");

// GET /:slug/announcements
exports.getAnnouncements = async (req, res) => {
    const basePath = `/${req.org.slug}`;
    try {
        const canCreate = req.userRole === "admin" || req.userRole === "coordinator";

        // Get user's registered event IDs for event-specific filtering
        let registeredEventIds = [];
        if (req.user && req.userRole === "student") {
            const myEvents = await Event.find({
                organization: req.org._id,
                registeredStudents: req.user._id
            }, "_id");
            registeredEventIds = myEvents.map(e => e._id.toString());
        }

        // Build query: show ALL announcements + event-specific ones user is registered for
        let query;
        if (canCreate) {
            // Admins/coordinators see all
            query = { organization: req.org._id };
        } else {
            query = {
                organization: req.org._id,
                $or: [
                    { targetType: "ALL" },
                    { targetType: "EVENT", eventId: { $in: registeredEventIds } }
                ]
            };
        }

        const announcements = await Announcement.find(query)
            .populate("createdBy", "name")
            .populate("eventId", "title")
            .sort({ createdAt: -1 });

        // Get events for create form (admins/coordinators only)
        let events = [];
        if (canCreate) {
            events = await Event.find({ organization: req.org._id }, "title").sort({ date: -1 });
        }

        res.render("events/announcements", {
            title: `Announcements — ${req.org.name}`,
            announcements,
            events,
            canCreate,
            basePath
        });
    } catch (err) {
        console.error("getAnnouncements error:", err);
        req.flash("error", "Failed to load announcements");
        res.redirect(`${basePath}/events`);
    }
};

// POST /:slug/announcements
exports.createAnnouncement = async (req, res) => {
    const basePath = `/${req.org.slug}`;
    try {
        const { title, message, targetType, eventId } = req.body;

        if (!title || !message) {
            req.flash("error", "Title and message are required");
            return res.redirect(`${basePath}/announcements`);
        }

        await Announcement.create({
            organization: req.org._id,
            createdBy: req.user._id,
            title: title.trim(),
            message: message.trim(),
            targetType: targetType || "ALL",
            eventId: targetType === "EVENT" && eventId ? eventId : null
        });

        req.flash("success", "Announcement posted! 📢");
        res.redirect(`${basePath}/announcements`);
    } catch (err) {
        console.error("createAnnouncement error:", err);
        req.flash("error", "Failed to post announcement");
        res.redirect(`${basePath}/announcements`);
    }
};

// DELETE /:slug/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
    const basePath = `/${req.org.slug}`;
    try {
        await Announcement.findOneAndDelete({
            _id: req.params.id,
            organization: req.org._id
        });
        req.flash("success", "Announcement deleted");
        res.redirect(`${basePath}/announcements`);
    } catch (err) {
        req.flash("error", "Failed to delete announcement");
        res.redirect(`${basePath}/announcements`);
    }
};
