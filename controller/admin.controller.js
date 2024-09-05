const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const Technology = require("../models/Technology")

exports.addTechnology = asyncHandler(async (req, res) => {
    const { name, category } = req.body
    const { isError, error } = checkEmpty({ name, category })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    await Technology.create({ name, category })
    res.json("Technology Created Success")
})
exports.getTechnology = asyncHandler(async (req, res) => {
    const result = await Technology.find()
    res.json("Technology Get Success", result)
})
exports.updateTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndUpdate(id, req.body)
    res.json("Technology Updated Success")
})
exports.deleteTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndDelete(id)
    res.json("Technology Deleted Success")
})