const router = require("express").Router()
const admin = require("../controller/admin.controller")

router
    .post("/add-tech", admin.addTechnology)
    .get("/get-tech", admin.getTechnology)
    .put("/update-tech/:id", admin.updateTechnology)
    .delete("/delete-tech/:id", admin.deleteTechnology)

    //   SOCIAL MEDIA

    .post("/add-social", admin.addSocial)
    .get("/get-social", admin.getSocial)
    .put("/update-social/:id", admin.updateSocial)
    .delete("/delete-social/:id", admin.deleteSocial)


    .post("/add-carasoul", admin.addCarousel)
    .get("/get-carasoul", admin.getCarousel)
    .put("/update-carasoul/:id", admin.updateCarousel)
    .delete("/delete-carasoul/:id", admin.deleteCarousel)


    .get("/fetch-project", admin.fetchProjects)
    .post("/add-project", admin.addProject)
    .delete("/delete-project/:id", admin.deleteProject)

module.exports = router