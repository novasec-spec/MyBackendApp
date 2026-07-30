const rateLimit=
require("express-rate-limit");

const authLimiter=
rateLimit({

windowMs:15*60*1000,

max:10,

standardHeaders:true,

legacyHeaders:false,

message:{

success:false,

message:"Too many login attempts. Try again later."

}

});

module.exports=authLimiter;
