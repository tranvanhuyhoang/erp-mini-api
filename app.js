// import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import jws from 'jws';
import jwt_decode from "jwt-decode";
import multer from 'multer';
import mainRoutes from './server/routes/main.js';
import productRouter from './server/routes/products';
import financeRouter from './server/routes/finance';
import customerRouter from './server/routes/customer';
import AuthMiddleWare from "./server/middleware/authMiddleware";
import {verify} from './server/auth/checkToken';
// import { checkToken } from './server/controllers/users';

dotenv.config();

// set up dependencies
const app = express();
const __dirname = path.resolve();

//read file from static url
// app.use(express.static("public"));


app.use('/uploads', express.static("uploads"));

app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

var corsOptions = {
  origin: `http://localhost:${process.env.PORT}`
};

app.use(cors());

var uploadMulter = multer();
// app.use(uploadMulter.array()); 

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage });
// app.use(upload.array()); // for parsing multipart/form-data

// set up mongoose
try {
  mongoose.connect(`mongodb://${process.env.DB_URL}`, { useNewUrlParser: true });
  console.log('Database connected');
} catch (error) {
  handleError(error);
  console.log('Error connecting to database');
}

// set up port number
const port = process.env.PORT;

// set up home route
app.get('/', (request, respond) => {
  // respond.status(200).json({
  //   message: 'Welcome to Project Support',
  // });
  respond.render("abc");
});

// function base64url(source) {
//   let encodedSource = Base64.stringify(Utf8.parse(source));
//   encodedSource = encodedSource.replace(/=+$/, '');
//   encodedSource = encodedSource.replace(/\+/g, '-');
//   encodedSource = encodedSource.replace(/\//g, '_');
//   return encodedSource;
// }

// function base64url(source) {
//   // Encode in classical base64
//   let encodedSource = CryptoJS.enc.Base64.stringify(Utf8.parse(source));

//   // Remove padding equal characters
//   encodedSource = encodedSource.replace(/=+$/, '');

//   // Replace characters according to base64url specifications
//   encodedSource = encodedSource.replace(/\+/g, '-');
//   encodedSource = encodedSource.replace(/\//g, '_');

//   return encodedSource;
// }

// function generateJWT(payload, secretOrPrivateKey, options){
//   if(!payload || !secretOrPrivateKey){
//       return {
//           error: true,
//           message: 'invalid parameters'
//       }
//   }

//   let header = {
//       "alg": "HS256",
//       "typ": "JWT"
//   }

//   if(options && options.alg){
//       header.alg = options.alg;
//   }

//   let stringifiedHeader = JSON.stringify(header);
//   let encodedHeader = base64url(stringifiedHeader);

//   let data = {};
//   Object.assign(data, payload);
//   var stringifiedData = JSON.stringify(data);
//   let encodedPayload = base64url(stringifiedData);

//   let token = encodedHeader + "." + encodedPayload;
//   let signature = CryptoJS.HmacSHA256(token, secretOrPrivateKey);
//       signature = base64url(signature);
//   let signedToken = token + "." + signature;
//   return signedToken;
// }

function decode(jwt, options){
  options = options || {};

  let decoded = jws.decode(jwt);
  if (!decoded) { return null; }
  var payload = decoded.payload;
  if(typeof payload === 'string') {
    try {
      var obj = JSON.parse(payload);
      if(obj !== null && typeof obj === 'object') {
        payload = obj;
      }
    } catch (e) { }
  }
  if (options.complete === true) {
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature
    };
  }
  return payload 
}


let token123 = generateJWT({"name": "hoangtran"},'hoang123456','');
console.log("token123 ", token123);
console.log("verifyJWT ", verifyJWT(token123,'hoang123456',''));


// set up route
// app.use('/', verify, checkToken);
app.use('/api/', mainRoutes);
app.use('/product', AuthMiddleWare, productRouter);
app.use('/customer', AuthMiddleWare, customerRouter);
app.use('/finance', AuthMiddleWare, financeRouter);

// app.use('/user', userRouter);

app.listen(port, (request, respond) => {
  console.log(`Our server is live on ${port}. Yay!`);
});


