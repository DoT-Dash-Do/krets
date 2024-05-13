import { errorHandler } from "./errorHandler.js";
import Jwt from "jsonwebtoken";

const verifyToken = (req,res,next) => {
    const token = req.body.token;
    if(!token) return next(errorHandler(401,'unAuthenticated'));
    Jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err)
            return next(errorHandler(403,'forbidden'));
        req.user = user;
        next();
    });
};
export default verifyToken;