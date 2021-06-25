import User from '../models/users';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

import {registerValidation, loginValidation} from '../auth/validation';
import {generateToken, verifyToken} from '../helpers/jwt.helper';

dotenv.config();

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "123456";

const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "982001";

// const debug = console.log.bind(console);

// create users
export async function createUser( req, res){
  
  // Validate user
  const{ error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email có tồn tại hay không
  const emailExist = await User.findOne({email: req.body.email});
  if(emailExist) return res.status(400).send("Email đã tồn tại");

  // Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(req.body.password, salt)// mã hóa password truyền vào và gán nó vào biến hashPass để có thể lưu pass vào database.
  
   // Tạo user
  const newuser = new User();
  newuser.name = req.body.name
  newuser.email = req.body.email
  newuser.password = hashPass
  try{
      const User = await newuser.save()
      res.send(User);
  }catch(err){
      res.status(400).send(err);
  }
}

export async function userLogin(req, res){


  // Validate user
  const{ error } = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Kiểm tra email
  const userLogin = await User.findOne({email: req.body.email});
  if(!userLogin) return res.status(200).send({
    status: false,
    message: "Không tìm thấy email"
  })

  // Kiểm tra password
  const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
  if(!passLogin) return res.status(200).send({
    status: false,
    message: "Mật khẩu không hợp lệ"
  })

  // Ký và tạo token
  const userData = {
    _id: userLogin._id,
    name: userLogin.name,
    email: userLogin.name,
  };
  const accessToken = await generateToken(userData, accessTokenSecret, accessTokenLife);
  const refreshToken = await generateToken(userData, refreshTokenSecret, refreshTokenLife);

  // const token = jwt.sign({_id: userLogin._id}, process.env.ACCESS_TOKEN_SECRET)
  res.header("auth-token", {accessToken, refreshToken}).send({
    status: true,
    data: {
      token: accessToken, 
      refreshToken
    }
  });
}

export async function refreshToken(req, res){
  const refreshTokenFromClient = req.body.refreshToken;
  // debug("tokenList: ", tokenList);
  
  if (refreshTokenFromClient) {
    try {
      // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
      const decoded = await verifyToken(refreshTokenFromClient, refreshTokenSecret);
      // debug("decoded: ", decoded);
      const userData = decoded.data;
      const accessToken = await generateToken(userData, accessTokenSecret, accessTokenLife);
      return res.status(200).json({accessToken});
    } catch (error) {
      // debug(error);
      res.status(403).json({
        message: 'Invalid refresh token.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'No token provided.',
    });
  }
};