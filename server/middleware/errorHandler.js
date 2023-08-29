import { MongooseError } from "mongoose"

const errorTypeMap = {
    "MongooseError.ValidationError": { status: 400, message: (error) => `Oops! There seems to be a validation error: ${error.message}` },
    "MongooseError.CastError": { status: 404, message: "Uh-oh! The resource you're looking for cannot be found." },
    "11000": { status: 409, message: "Hold on! It looks like there's a duplicate key error." },
    "JsonWebTokenError": { status: 401, message: "Hmm... The token provided seems to be invalid." },
    "SyntaxError": { status: 400, message: (error) => `Oops! There seems to be a syntax error: ${error.message}` },
    "ValidationError": { status: 400, message: (error) => ([`Oops! There seems to be a validation error:`, ...error.errors ]) },
    "AuthError": { status: 401, message: (error) => `Uh-oh! There seems to be a auth error: ${error.message}` },
    "TokenExpiredError": { status: 401, message: "Oh no! Your token has expired." },
    "InvalidOTP": { status: 400, message: "Oh no! Your otp is invalid." },
    "SendingEmail": { status: 424, message:"Couldn't Send Email..." },
}


/**
 * @description middleware function which sends appropriate error response to the client 
 * @param {Error} error Error Object 
 * @param {Request} req Express.js Request Object
 * @param {Response} res Express.js Response Object
 * @param {Function} next Next Middleware Function
 */
function errorHandler(error, req, res, next) {
    console.log(`[server]: Request: ${req.path} - [error]: ${error.message}`);

    const errorType = error.code || error.name;
    const errorInfo = errorTypeMap[errorType] || { status: 500, message: "Internal Server Error" };

    res.status(errorInfo.status).json({
        message: typeof errorInfo.message === 'function' ? errorInfo.message(error) : errorInfo.message
    });
}

export default errorHandler