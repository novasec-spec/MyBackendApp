const authService =
require("../services/authService");

exports.register =
async (req,res)=>{

try{

const result =
await authService.register(
req.body,
req
);

res.status(201).json({

success:true,

message:"Registration successful.",

...result

});

}

catch(err){

res.status(400).json({

success:false,

message:err.message

});

}

};

exports.login =
async (req,res)=>{

try{

const result =
await authService.login(

req.body.email,

req.body.password,

req

);

res.json({

success:true,

message:"Login successful.",

...result

});

}

catch(err){

res.status(401).json({

success:false,

message:err.message

});

}

};
