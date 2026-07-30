const {body,validationResult}
=
require("express-validator");

const registerValidation=[

body("username")
.isLength({min:3,max:30}),

body("email")
.isEmail(),

body("password")
.isLength({min:8})

];

function validate(req,res,next){

const errors=
validationResult(req);

if(!errors.isEmpty()){

return res.status(400).json({

success:false,

errors:errors.array()

});

}

next();

}

module.exports={

registerValidation,

validate

};
