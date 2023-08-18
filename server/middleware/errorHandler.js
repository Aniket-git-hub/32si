import { MongooseError } from "mongoose"

/**
 * @description middleware function which sends appropriate error response to the client 
 * @param {Error} error Error Object 
 * @param {Request} req Express.js Request Object
 * @param {Response} res Express.js Response Object
 * @param {Function} next Next Middleware Function
 */
function errorHandler(error, req, res, next) {
    console.log(error.message)
    if (error instanceof MongooseError.ValidationError) {
        res.status(400).json({
            message: error.message
        })
    } else if (error instanceof MongooseError.CastError) {
        res.status(404).json({
            message: "Resource Not Found"
        })
    } else if (error.code === 11000) {
        res.status(409).json({
            message: "Duplicate Key Error"
        })
    } else if (error.name === "JsonWebTokenError") {
        res.status(401).json({
            message: "Invalid Token"
        })
    } else if (error.name === "SyntaxError") { 
        res.status(400).json({
            message:error.message
        })
    } else if (error.name === "ValidationError") { 
        res.status(400).json({
            errors: error.errors
        })
    } else {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export default errorHandler