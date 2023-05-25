const express = require("express");
const tokenRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

tokenRouter.post("/login", async (req, res) => {
  const { auth_token } = req.body;

  try {
    const user = await User.findOne({ auth_token });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.token) {
      user.token = null;
    }
   
    jwt.sign({ user }, "secretkey", (err, token) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      user.token = token;

      res.json({
        message: "New token added!",
        token,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
};

const testHandler = (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
  
      if (authData.user.auth_token == req.headers["userid"]) {
        const data = req.data;
        
        res.json({
          message: "Authorized",
          data: data, 
        });
      } else {
        res.status(403).json({
          error: "Unauthorized",
        });
      }
    }
  });
};

module.exports = { verifyToken, testHandler, tokenRouter };