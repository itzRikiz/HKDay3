const express = require("express");
const app = express();
app.use(express.json());

const users = [];

function generateToken(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

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
    const token = generateToken();
    foundUser.token = token;
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

app.listen(3000);
