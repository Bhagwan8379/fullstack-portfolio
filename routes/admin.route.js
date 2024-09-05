const router = require("express").Router()
const admin = require("../controller/admin.controller")

router
    .post("/add-tech", admin.addTechnology)
    .post("/get-tech", admin.getTechnology)
    .post("/update-tech/:id", admin.updateTechnology)
    .post("/delete-tech/:id", admin.deleteTechnology)



module.exports = router