const express 	= require('express');
const router 	= express.Router();
const {body, validationResult} 		= require('express-validator');
const userModel = require.main.require('./models/userModel');

router.get('/', (req, res)=>{
	res.render('login');	
});

router.post('/',[
    
    body('email')
    .notEmpty()
    .withMessage('Email is required'),
    
    body('password')
    .notEmpty()
    .withMessage('Phone number is required'),
    
],(req, res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    }else{
        user={
            email: req.body.email,
            password:req.body.password
        
        };
 
    };
    userModel.validate(user, function(status){
        if(status == true){
            req.session.email = user.email; 
             userModel.getByEmail(user.email, function(result){
                req.session.username = result[0].username;
                req.session.user_role = result[0].user_role;
                if(result[0].user_role =="admin"){
                    res.redirect('/admin');
                 }
                 else if(result[0].user_role=="manager"){
                    res.redirect('/home');
                }
                else if(result[0].user_type=="customer"){
                    res.redirect('/customer');
                }
             }  );
        } else {
            console.log("Invalid Password/Email");
            res.send("Failed Login");
        }
            })  
    });
module.exports = router;