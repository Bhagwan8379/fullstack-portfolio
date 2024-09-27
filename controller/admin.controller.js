const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const Technology = require("../models/Technology")
const Social = require("../models/Social")
const Carasoul = require("../models/Carasoul")
const path = require("path")
const cloudinary = require("../utils/cloudinary.config")
const { upload, projectUpload } = require("../utils/upload")
const Projects = require("../models/Projects")


exports.addTechnology = asyncHandler(async (req, res) => {
    const { name, category } = req.body
    const { isError, error } = checkEmpty({ name, category })
    if (isError) {
        return res.status(400).json({ message: "All Fields Required", error })
    }
    await Technology.create({ name, category })
    res.json({ message: "Technology Created Success" })
})
exports.getTechnology = asyncHandler(async (req, res) => {
    const result = await Technology.find()
    res.json({ message: "Technology Get Success", result })
})
exports.updateTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndUpdate(id, req.body)
    res.json({ message: "Technology Updated Success" })
})
exports.deleteTechnology = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Technology.findByIdAndDelete(id)
    res.json({ message: "Technology Deleted Success" })
})


//   SOCIAL MEDIA

exports.addSocial = asyncHandler(async (req, res) => {
    await Social.create(req.body)
    res.json({ message: "SocialMedia Added Success" })
})

exports.getSocial = asyncHandler(async (req, res) => {
    const result = await Social.find()
    res.json({ message: "SocialMedia Fetch Success", result })
})
exports.updateSocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndUpdate(id, req.body)
    res.json({ message: "SocialMedia Updated Success" })
})
exports.deleteSocial = asyncHandler(async (req, res) => {
    const { id } = req.params
    await Social.findByIdAndDelete(id)
    res.json({ message: "SocialMedia Deleted Success" })
})




exports.addCarousel = asyncHandler(async (req, res) => {
    upload(req, res, async err => {
        const { caption } = req.body
        const { isError, error } = checkEmpty({ caption })
        if (isError) {
            return res.status(400).json({ message: "All Fiel Required", error })
        } if (!req.file) {
            return res.status(400).json({ message: " hero image is Required" })
        }
        console.log(req.file);

        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        await Carasoul.create({ ...req.body, hero: secure_url })
        res.json({ message: "Caresoul Added Success" })
    })

})

exports.getCarousel = asyncHandler(async (req, res) => {

    const result = await Carasoul.find()
    res.json({ message: "Carousel Fetch Success", result })
})

exports.updateCarousel = asyncHandler(async (req, res) => {
    upload(req, res, async err => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "multer Error", error: err.message })
        }
        const { id } = req.params
        if (req.file) {
            const result = await Carasoul.findById(id)
            await cloudinary.uploader.destroy(path.basename(result.hero))
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Carasoul.findByIdAndUpdate(id, { caption: req.body.caption, hero: secure_url })
            res.json({ message: "Caresoul Updated Success" })
        }
        await Carasoul.findByIdAndUpdate(id, { caption: req.body.caption })
        // res.json({ message: "Caresoul Updated Success" })
    })
})

exports.deleteCarousel = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Carasoul.findById(id)
    console.log(result);

    await cloudinary.uploader.destroy(path.basename(result.hero))
    await Carasoul.findByIdAndDelete(id)
    res.json({ message: "Carousel Deleted Success" })
})





exports.addProject = asyncHandler(async (req, res) => {
    projectUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Multer Error" })
        }
        // const {error,isError } = checkEmpty({title, shortdesc, desc, duration, learning, images})
        if (
            !req.files["images"] ||
            !req.files["screenshots-Web-main"] ||
            !req.files["screenshots-Web-other"] ||
            !req.files["screenshots-Mobile-main"] ||
            !req.files["screenshots-Mobile-other"] ||
            !req.files["sections-web-images"] ||
            !req.files["sections-mobile-images"]
        ) {
            return res.status(400).json({ message: "All Images Required" })
        }
        let images = {}
        for (const key in req.files) {
            if (key === "screenshots-Web-other" || key === "screenshots-Mobile-other") {
                if (!images[key]) {
                    images[key] = []
                }
                const uploadAllImagesPromises = []
                for (const item of req.files[key]) {
                    uploadAllImagesPromises.push(cloudinary.uploader.upload(item.path))
                }
                const allData = await Promise.all(uploadAllImagesPromises)
                images[key] = allData.map(item => item.secure_url)
            } else {
                const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path)
                images[key] = secure_url
            }
        }
        // console.log(images);
        // console.log(req.files);
        // console.log(req.body);

        await Projects.create({
            title: req.body.title,
            shortdesc: req.body.shortdesc,
            desc: req.body.desc,
            duration: req.body.duration,
            learning: req.body.learning,
            images: images.images,
            live: req.body.live,
            source: req.body.source,
            isMobileApp: req.body.isMobileApp,
            technologies: {
                frontend: req.body.FrontEnd,
                backend: req.body.BackEnd,
                mobile: req.body.Mobile,
                collabration: req.body.Collabration,
                hoisting: req.body.Hoisting,
            },
            sections: {
                web: [
                    {
                        title: req.body["sections-web-title"],
                        desc: req.body["sections-web-desc"],
                        images: images["sections-web-images"],
                    }
                ],
                mobile: [
                    {
                        title: req.body["sections-mobile-title"],
                        desc: req.body["sections-mobile-desc"],
                        images: images["sections-mobile-images"],
                    }
                ],
            },
            screenshots: {
                web: {
                    main: images["screenshots-Web-main"],
                    other: images["screenshots-Web-other"].map(item => item)
                },
                mobile: {
                    main: images["screenshots-Mobile-main"],
                    other: images["screenshots-Mobile-other"] && images["screenshots-Mobile-other"].map(item => item)
                }
            },
        })
        res.json({ message: "Project Add Success...!" })
    })
})



exports.fetchProjects = asyncHandler(async (req, res) => {
    const result = await Projects.find()
    res.json({ message: "Project Fetch Success...!", result })
})

exports.deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params
    const result = await Projects.findById(id)
    const allImages = []
    allImages.push(cloudinary.uploader.destroy(path.basename(result.images)))
    for (const item of result.sections.web) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item.images)))
    }

    for (const item of result.sections.mobile) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item.images)))
    }


    allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.web.main)))
    allImages.push(cloudinary.uploader.destroy(path.basename(result.screenshots.mobile.main)))

    for (const item of result.screenshots.web.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }

    for (const item of result.screenshots.mobile.other) {
        allImages.push(cloudinary.uploader.destroy(path.basename(item)))
    }
    await Promise.all(allImages)
    await Projects.findByIdAndDelete(id)
    res.json({ message: "Project Delete Success...!" })
})




