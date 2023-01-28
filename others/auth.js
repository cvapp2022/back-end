const jwt = require("jsonwebtoken")


exports.generateToken = function(user){
    var token= jwt.sign({_id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3h"})

    return token;
    
}

exports.validateToken= function(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    if(authHeader){
        
        const token = authHeader.split(" ")[1]
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) return res.sendStatus(400).send("Token not present")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) { 
            return res.status(403).send("Token invalid")
            }
            else {
            req.user = user
            next() //proceed to the next action in the calling function
            }
        })
    }
    else{
        return res.status(403).send("Token bad")
    }
}