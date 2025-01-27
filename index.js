const express = require("express");
const jwt = require('jsonwebtoken')
const  JWT_SECRET ="randomjwtsecret"
const app = express();
app.use(express.json());

const users = [];


app.post("/signup", function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;

  if (users.find((u) => u.userName === userName)) {
    res.json({
      message: "You Are Already Signedup",
    });
    return;
  }
  users.push({
    userName: userName,
    password: password,
  });
  res.json("You Are Signed In");
  console.log(users);
});

app.post("/signin", function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  const foundUser = users.find(
    (u) => u.userName === userName && u.password === password
  );
  if (foundUser) {
    const token = jwt.sign({
      userName:userName
    },JWT_SECRET)

    // foundUser.token = token; //not required anymore. because jwt is stateless

    res.json({
      token: token,
    });
  } else {
    res.status(404).send({
      message: "invalid UserName and Password",
    });
  }
  console.log(users);
});

app.use(function(req,res,next){
  const token =req.headers.authorization;
  if(!token){
    return res.json({
      message:"Token is missing"
    })
  }
 const decodedData = jwt.verify(token,JWT_SECRET)
 if(decodedData.userName){
  req.userName = decodedData.userName
  next()
 }else{
  return res.json({
    message:"You are not Logged In"
  })
 }
})
app.get('/me',function(req,res){
  const foundUser = users.find((u)=>u.userName===req.userName)
  if(foundUser){
    return res.json({
      userName:foundUser.userName,
      password:foundUser.password
    })
  }else{
    return res.json({
      message:"User Not Found"
    })
  }
})

app.listen(3000);
