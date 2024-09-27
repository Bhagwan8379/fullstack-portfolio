const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const path = require("path")
const { adminProtected } = require("./middleware/protected")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.static("dist"))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true             //For Cookie Send and Get
}))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/admin", adminProtected, require("./routes/admin.route"))
app.use("/api/public", require("./routes/public.routes"))

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "Resource Not Found" })
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: `SERVER ERROR ${err.message}` })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(process.env.PORT, console.log("SERVER RUNNNING 🏃‍♂️"))
})
