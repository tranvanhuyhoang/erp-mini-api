import {verifyToken} from "../helpers/jwt.helper";
import dotenv from 'dotenv';

dotenv.config();
// const debug = console.log.bind(console);
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "19982001";

let isAuth = async (req, res, next) => {
  const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = await verifyToken(tokenFromClient, accessTokenSecret);
      req.jwtDecoded = decoded;
      next();
    } catch (error) {
      // debug("Error while verify token:", error);
      return res.status(401).json({
        message: 'Token hết hạn hoặc không hợp lệ.',
      });
    }
  } else {
    return res.status(403).send({
      message: 'Không nhận được thông tin token',
    });
  }
}

export default isAuth;