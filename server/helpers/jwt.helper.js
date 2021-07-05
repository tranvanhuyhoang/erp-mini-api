import jwt from 'jsonwebtoken';

// export let generateToken = (user, secretSignature, tokenLife) => {
//   return new Promise((resolve, reject) => {
//     const userData = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//     }
//     // Thực hiện ký và tạo token
//     jwt.sign(
//       {data: userData},
//       secretSignature,
//       {
//         algorithm: "HS256",
//         expiresIn: tokenLife,
//       },
//       (error, token) => {
//         if (error) {
//           return reject(error);
//         }
//         resolve(token);
//     });
//   });
// }

function base64url(source) {
  let encodedSource = Base64.stringify(Utf8.parse(source));
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}

export function generateToken(payload, secretOrPrivateKey, options){
  if(!payload || !secretOrPrivateKey){
      return reject('invalid parameters');
  }

  let header = {
      "alg": "HS256",
      "typ": "JWT"
  }

  if(options && options.alg){
      header.alg = options.alg;
  }

  let stringifiedHeader = JSON.stringify(header);
  let encodedHeader = base64url(stringifiedHeader);

  let data = {};
  Object.assign(data, payload);
  var stringifiedData = JSON.stringify(data);
  let encodedPayload = base64url(stringifiedData);

  let token = encodedHeader + "." + encodedPayload;
  let signature = CryptoJS.HmacSHA256(token, secretOrPrivateKey);
      signature = base64url(signature);
  let signedToken = token + "." + signature;
  resolve(signedToken);
  // return signedToken;
}

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

export function verifyToken(jwtString, secretOrPrivateKey){
  
  let parts = jwtString.split('.');
  if (parts.length !== 3){
    return reject('jwt malformed');
    // return {
    //     error: true,
    //     name: 'jwtError',
    //     message: 'jwt malformed'
    // }
  }

  let decodedToken = decode(jwtString, { complete: true });
  if (!decodedToken) {
    return reject('invalid token');
    // return {
    //     error: true,
    //     name: 'jwtError',
    //     message: 'invalid token'
    // }
  }
  
  // let header = decodedToken.header;
  let hasSignature = parts[2].trim() !== '';
  if (!hasSignature && secretOrPrivateKey){
    return reject('jwt signature is required');
    // return {
    //   error: true,
    //   name: 'jwtError',
    //   message: 'jwt signature is required'
    // }
  }

  if (hasSignature && !secretOrPrivateKey) {
    return reject('secret or public key must be provided');
    // return {
    //   error: true,
    //   name: 'jwtError',
    //   message: 'secret or public key must be provided'
    // }
  }

  if(decodedToken.header.alg !== 'HS256'){
      return reject('invalid algorithm');
      // {
      //     error: true,
      //     name: 'jwtError',
      //     message: 'invalid algorithm'
      // }
  }

  // console.log("jwtString ", jwtString);
  // console.log("signature ", decodedToken.signature);
  // console.log("decodedToken.header.alg ", decodedToken.header.alg);
  // console.log("secretOrPrivateKey ", secretOrPrivateKey);


  var signature = CryptoJS.HmacSHA256(parts[0] + "." + parts[1], secretOrPrivateKey).toString();
  signature = base64url(signature)

  if(signature === parts[2]){
    console.log("JWT duoc chap nhan");
    resolve(decoded);
    return true;
  }else{
    console.log("JWT sai");
    reject("JWT sai")
    return false;
  }

  // let valid = jws.verify(signature, 'HS256', secretOrPrivateKey);
  // console.log("valid ", valid)
  
  // if (!valid) {
  //     return {
  //         error: true,
  //         name: 'jwtError',
  //         message: 'invalid signature'
  //     }
  // }

  // let payload = decodedToken.payload;
  // if (options && options.complete === true) {
  //   let signature = decodedToken.signature;

  //   return done(null, {
  //     header: header,
  //     payload: payload,
  //     signature: signature
  //   });
  // }

  // return payload 
}



// export let verifyToken = (token, secretKey) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, secretKey, (error, decoded) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(decoded);
//     });
//   });
// }
