const Organization = require("../models/Organization");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");

// GET /:slug/page — public org landing page
exports.showPublicPage = async (req, res) => {
    try {
        const org = await Organization.findById(req.org._id);
        const page = org.orgPage || {};

        // Get published events
        const events = await Event.find({ organization: req.org._id })
            .sort({ featured: -1, date: 1 })
            .limit(12);

        // Get recent announcements (ALL type only for public)
        let announcements = [];
        if (page.showAnnouncements) {
            announcements = await Announcement.find({
                organization: req.org._id,
                targetType: "ALL"
            }).sort({ createdAt: -1 }).limit(5);
        }

        // Determine theme
        const theme = resolveTheme(page);

        res.render("org-public-page", {
            title: `${org.name} — Campus Pulse`,
            orgData: org.toObject(),
            page,
            events: events.map(e => ({
                ...e.toObject(),
                status: getEventStatus(e),
                deadlinePassed: e.registrationDeadline ? new Date() > new Date(e.registrationDeadline) : false
            })),
            announcements,
            theme,
            basePath: `/${org.slug}`
        });
    } catch (err) {
        console.error("showPublicPage error:", err);
        req.flash("error", "Failed to load organization page");
        res.redirect("/");
    }
};

// GET /:slug/manage/customize — admin customization form
exports.showCustomizePage = async (req, res) => {
    try {
        const org = await Organization.findById(req.org._id);
        const events = await Event.find({ organization: req.org._id }).sort({ createdAt: -1 });
        
        res.render("customize-org", {
            title: `Customize — ${org.name}`,
            orgData: org.toObject(),
            page: org.orgPage || {},
            events: events.map(e => e.toObject()),
            theme: resolveTheme(org.orgPage || {}),
            basePath: `/${org.slug}`
        });
    } catch (err) {
        req.flash("error", "Failed to load customization page");
        res.redirect(`/${req.org.slug}/manage`);
    }
};

// POST /:slug/manage/customize — save page config
exports.saveCustomization = async (req, res) => {
    try {
        const {
            theme, fontFamily, titleColor, customPrimary, customAccent, customBg, customText,
            bannerUrl, logoUrl, tagline,
            showAbout, showAnnouncements, showSponsors,
            aboutText, aboutWho, aboutHighlights,
            sponsorNames, sponsorLogos, sponsorLinks
        } = req.body;

        // Parse highlights (textarea, one per line)
        const highlights = aboutHighlights
            ? aboutHighlights.split("\n").map(h => h.trim()).filter(Boolean)
            : [];

        // Parse sponsors from parallel arrays
        const sponsors = [];
        if (sponsorNames) {
            const names = Array.isArray(sponsorNames) ? sponsorNames : [sponsorNames];
            const logos = Array.isArray(sponsorLogos) ? sponsorLogos : [sponsorLogos || ""];
            const links = Array.isArray(sponsorLinks) ? sponsorLinks : [sponsorLinks || ""];
            for (let i = 0; i < names.length; i++) {
                if (names[i] && names[i].trim()) {
                    sponsors.push({
                        name: names[i].trim(),
                        logoUrl: (logos[i] || "").trim(),
                        link: (links[i] || "").trim()
                    });
                }
            }
        }

        const org = await Organization.findById(req.org._id);
        org.orgPage = {
            theme: theme || "dark",
            customPrimary: theme === "custom" ? (customPrimary || null) : null,
            customAccent: theme === "custom" ? (customAccent || null) : null,
            customBg: theme === "custom" ? (customBg || null) : null,
            customText: theme === "custom" ? (customText || null) : null,
            bannerUrl: bannerUrl || null,
            logoUrl: logoUrl || null,
            tagline: tagline || null,
            fontFamily: fontFamily || "DM Sans",
            titleColor: titleColor || null,
            showAbout: showAbout === "on",
            showAnnouncements: showAnnouncements === "on",
            showSponsors: showSponsors === "on",
            aboutText: aboutText || null,
            aboutWho: aboutWho || null,
            aboutHighlights: highlights,
            sponsors
        };

        org.markModified("orgPage");
        await org.save();
        req.flash("success", "Page customization saved! 🎨");
        res.redirect(`/${req.org.slug}/manage/customize`);
    } catch (err) {
        console.error("saveCustomization error:", err);
        req.flash("error", "Failed to save customization");
        res.redirect(`/${req.org.slug}/manage/customize`);
    }
};

// Helper: resolve theme colors
function resolveTheme(page) {
    const presets = {
        dark:    { primary: "#7c5cfc", accent: "#a78bfa", bg: "#0a0a0f", text: "#e8e8f0", surface: "#13131a", border: "#1e1e2e", muted: "#6b6b8a", dark: true },
        light:   { primary: "#7c5cfc", accent: "#a78bfa", bg: "#f9fafb", text: "#1a1a2e", surface: "#ffffff", border: "#e5e7eb", muted: "#6b7280", dark: false },
        blue:    { primary: "#2563eb", accent: "#3b82f6", bg: "#0a0f1a", text: "#e8ecf0", surface: "#111827", border: "#1e293b", muted: "#64748b", dark: true },
        purple:  { primary: "#7c3aed", accent: "#8b5cf6", bg: "#0f0a1a", text: "#ede9fe", surface: "#1a1025", border: "#2e1a4a", muted: "#7c6b9a", dark: true },
        teal:    { primary: "#0d9488", accent: "#14b8a6", bg: "#0a1a1a", text: "#e8f0f0", surface: "#0f2525", border: "#1a3a3a", muted: "#5f8a8a", dark: true },
        emerald: { primary: "#059669", accent: "#10b981", bg: "#0a1a0f", text: "#e8f0ec", surface: "#0f2518", border: "#1a3a25", muted: "#5f8a6b", dark: true },
        orange:  { primary: "#ea580c", accent: "#f97316", bg: "#1a0f0a", text: "#f0ece8", surface: "#251a0f", border: "#3a2a1a", muted: "#8a7560", dark: true }
    };

    const themeKey = page.theme || "dark";
    let t = presets[themeKey] || presets.dark;

    // Apply custom overrides
    if (page.customPrimary) t = { ...t, primary: page.customPrimary };
    if (page.customAccent) t = { ...t, accent: page.customAccent };
    if (page.customBg) t = { ...t, bg: page.customBg };
    if (page.customText) t = { ...t, text: page.customText };

    return t;
}

function getEventStatus(event) {
    const now = new Date();
    const start = new Date(event.date);
    const end = new Date(start);
    end.setHours(start.getHours() + (event.durationHours || 2));
    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Completed";
}

module.exports.resolveTheme = resolveTheme;

// PATCH /:slug/manage/events/:eventId/featured — toggle featured status for an event
exports.toggleFeaturedEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.eventId, organization: req.org._id });
        if (!event) return res.status(404).json({ message: "Event not found" });

        event.featured = !event.featured;
        await event.save();
        res.json({ message: event.featured ? "Marked as featured!" : "Removed from featured", featured: event.featured });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
