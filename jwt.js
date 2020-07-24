const ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //fromAuthHeaderWithScheme('JWT'),
  secretOrKey: 'secret', // todo: change in production
  //issuer: 'accounts.examplesoft.com',
  //audience: 'yoursite.net',
};

function sign(payload){
  return jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: "7d"})
}

module.exports = {sign, options: jwtOptions};