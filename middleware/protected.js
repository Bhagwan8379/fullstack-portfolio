const jwt = require("jsonwebtoken")

exports.adminProtected = (req, res, next) => {
    // 1 cookie 
    const { user } = req.cookies
    // console.log(user);

    if (!user) {
        return res.status(401).json({ message: "No Cookie Found" })
    }
    // 2 token verify  
    jwt.verify(user, process.env.JWT_KEY, (error, decode) => {
        if (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid Token" })

        }
        req.user = decode.userId

    })
    next()
}