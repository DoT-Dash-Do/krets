import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { transporter } from "../utils/nodeMailer.js";
import { htmlResponse } from "../utils/htmlResponse.js";
export const signup = async (req, res, next) => {
  const { Name,username, email, password } = req.body;
  const hasshedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({Name,username, email, password: hasshedPassword });
  try {
    const user = await newUser.save();
    const verifyLink = user.email + "$&_&$" + user._id; 
    transporter.sendMail(
      {
        from: "fakesteam26@gmail.com",
        to: newUser.email,
        subject: "verification mail",
        text: "",
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 10px; padding: 20px;">
              <h2 style="text-align: center; color: #333;">Email Verification</h2>
              <p style="text-align: left; color: #333;">Dear User,</p>
              <p style="text-align: left; color: #333;">Welcome to our platform! To complete your registration, please click the link below to verify your email address:</p>
              <p style="text-align: center; margin-top: 30px;"><a href="http://localhost:3431/api/auth/verify-mail/${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
              <p style="text-align: left; color: #333;">If you didn't sign up for our platform, you can ignore this email.</p>
              <p style="text-align: left; color: #333;">Thanks,<br> krets</p>
          </div>
      </div>`,
      },
      (error, info) => { Value
        if (error) {
          return next(
            errorHandler(401, "Not able to send the verification mail")
          );
        }
      }
    );
    return res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    next(errorHandler(550, "username or email already exists"));
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const chk = req.params.chk;
    const linkSplit = chk.split("$&_&$");
    await User.findByIdAndUpdate(
      linkSplit[1],
      { verified: true },
      { new: true }
    );
    res.status(200).send(htmlResponse);
  } catch (error) {
    res.status(200).send("<p>email not verified</p>");
  }
};

export const login = async(req,res,next) =>{
  const {email, password} = req.body;
    try{
        const validU = await User.findOne({email});
        if(!validU)
            return next(errorHandler(404,'wrong credentials'));
        const passCheck = await bcrypt.compare(password,validU.password);
        if(!passCheck)
        {
          return next(errorHandler(401,'wrong credentials'));
        }
            
        if(validU.verified === false)
        {
          return next(errorHandler(401,'email not verified'));
        }
        const token = jwt.sign({id:validU._id},process.env.JWT_SECRET);
        const{password:pass,...rest} = validU._doc;
        res
        .status(200)
        .json({rest,token});
    }
    catch(error){
        next(errorHandler(401,'wrong credentials'));
    }
}

