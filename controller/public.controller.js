const asyncHandler = require("express-async-handler")
const Projects = require("../models/Projects")
const Carasoul = require("../models/Carasoul")

exports.fetchProjects = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Project Fetch Success...!", result })
})
exports.getAllCarousel = asyncHandler(async (req, res) => {
    const result = await Carasoul.find()
    res.status(200).json({ message: "blog fetch success", result })
})

exports.getProjectDetails = asyncHandler(async (req, res) => {
    const result = await Projects.findById(req.params.id)
    res.status(200).json({ message: "blog fetch success", result })
})