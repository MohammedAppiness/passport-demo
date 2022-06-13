const express=require('express');
const mongoose = require('mongoose');
const app=express();
const passport=require('passport')
const Joi = require('joi');
const registerModel=require('./model/register')
const session = require('express-session');
mongoose.connect('mongodb://localhost:27017/passport-demo').then(console.log('connected to db'))

const LocalStrategy = require('passport-local');

const schema=Joi.object({
 email:Joi.string().email().required(),
  username:Joi.string().alphanum().min(3).max(10),
  password:Joi.string().required()
})
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(registerModel.authenticate()));

passport.serializeUser(registerModel.serializeUser());
passport.deserializeUser(registerModel.deserializeUser());


app.use(express.urlencoded({extended:true}));


app.set('view engine', 'ejs');

app


app.get('/register',(req,res)=>{
    
    res.render('register')
})


app.post('/register',async(req,res,next)=>{

  try {
    const { email, username, password } = req.body;

    const user=new registerModel({email: req.body.email, username : req.body.username});

   
 
    const regsitering=await registerModel.register(user,password);
   console.log(regsitering)
    res.send('user registered')
  } catch (error) {
      next(error)
  }

  

})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',(req,res,next)=>{
    const schema=Joi.object({
         username:Joi.string().alphanum().min(3).max(10),
         password:Joi.string().required()
       })
       const {error}= schema.validate(req.body);

console.log(error)
       if(!error){
           console.log('here!!')
         next()
       }else{
    
        throw new Error(error)
       }
    
        

},
passport.authenticate('local', {failureRedirect: '/login-fail' })
,(req,res)=>{

res.send('welcome you have logged in successfully')

})

app.get('/login-fail',(req,res)=>{
    res.send('please eneter correct email or password')
})




app.use((err,req,res,next)=>{
    res.send(err.message)
})



app.listen(3000,()=>console.log('server running ...'))
