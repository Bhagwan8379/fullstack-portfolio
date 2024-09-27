const mongoose = require("mongoose")

const carouselSchema = new mongoose.Schema({
    caption: { type: String },
    hero: { type: String },

}, { timestamps: true })

module.exports = mongoose.model("carousel", carouselSchema)