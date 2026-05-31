const Event = require("../models/Event");

// GET /:slug/analytics — admin analytics dashboard
exports.getAnalytics = async (req, res) => {
    const basePath = `/${req.org.slug}`;
    try {
        const events = await Event.find({ organization: req.org._id })
            .populate("registeredStudents", "name email")
            .sort({ date: -1 });

        const totalEvents = events.length;
        const totalRegistrations = events.reduce((sum, e) => sum + e.registeredStudents.length, 0);
        const totalAttendance = events.reduce((sum, e) => sum + e.attendance.length, 0);

        // Revenue from paid events
        const totalRevenue = events.reduce((sum, e) => {
            if (e.isPaid && e.registrationFee > 0) {
                const confirmedPayments = e.payments ? e.payments.filter(p => p.status === "success").length : 0;
                return sum + (confirmedPayments * e.registrationFee);
            }
            return sum;
        }, 0);

        // Per-event breakdown
        const eventBreakdown = events.map(e => {
            const registered = e.registeredStudents.length;
            const attended = e.attendance.length;
            const revenue = e.isPaid ? (e.payments ? e.payments.filter(p => p.status === "success").length : 0) * e.registrationFee : 0;
            const attendanceRate = registered > 0 ? Math.round((attended / registered) * 100) : 0;

            return {
                _id: e._id,
                title: e.title,
                category: e.category,
                date: e.date,
                registered,
                attended,
                revenue,
                attendanceRate,
                maxSeats: e.maxSeats,
                featured: e.featured
            };
        });

        // Category distribution
        const categoryStats = {};
        events.forEach(e => {
            if (!categoryStats[e.category]) categoryStats[e.category] = 0;
            categoryStats[e.category]++;
        });

        res.render("events/analytics", {
            title: `Analytics — ${req.org.name}`,
            analytics: {
                totalEvents,
                totalRegistrations,
                totalAttendance,
                totalRevenue,
                attendanceRate: totalRegistrations > 0 ? Math.round((totalAttendance / totalRegistrations) * 100) : 0
            },
            eventBreakdown,
            categoryStats,
            basePath
        });
    } catch (err) {
        console.error("getAnalytics error:", err);
        req.flash("error", "Failed to load analytics");
        res.redirect(`${basePath}/events`);
    }
};
