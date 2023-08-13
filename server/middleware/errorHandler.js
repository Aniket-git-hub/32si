import { MongooseError } from "mongoose"

function errorHandle(error, req, res, next) {
    console.log(error)
    if (error instanceof MongooseError.ValidationError) {
        res.status(400).json({
            message: error.message
        })
    } else if (error instanceof MongooseError.CastError) {
        res.status(404).json({
            message:"Resource Not Found"
        })
    } else if (error.code === 11000) {
        res.status(409).json({
            message: "Duplicate key error"
        })
    } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({
            message: "Invalid token"
        })
    } else {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}

export default errorHandle