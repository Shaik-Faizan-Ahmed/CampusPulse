const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true
        },
        targetType: {
            type: String,
            enum: ["ALL", "EVENT"],
            default: "ALL"
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            default: null
        }
    },
    { timestamps: true }
);

announcementSchema.index({ organization: 1, createdAt: -1 });

module.exports = mongoose.model("Announcement", announcementSchema);
