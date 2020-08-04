const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const user = require("../models/user");

router.get('/', async (req, res) => {
  let userId = req.session.userId;
  if(userId) {
    let user = await User.findById(userId).select('id email fullname phone address');
    res.status(200).json(user);
  } else {
    res.status(401).json({
      message: 'Please login into your account.'
    });
  }
});

router.put('/change-password', async (req, res) => {
  let userId = req.session.userId;
  if(userId) {
    if(req.body.password !== undefined && req.body.passwordConfirmation !== undefined) {
      if(req.body.password === req.body.passwordConfirmation) {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(req.body.password, salt);
        let user = await User.findById(userId);
        user.password = hash;
        await user.save();

        res.status(200).json({
          message: 'Password was changed successfully.'
        });
      } else {
        res.status(400).json({
          message: 'Password confirmation doesn\'t match Password.'
        });  
      }
    } else {
      res.status(400).json({
        message: 'Missing parameters.'
      });
    }
  } else {
    res.status(401).json({
      message: 'Please login into your account.'
    });
  }
});

router.post('/', async (req, res) => {
  let ps = {id: 0};

  try{
    if(req.body.email && req.body.password && req.body.name){
      ps.id = 1;
    }
  }catch(err){
    console.log(err);
  }

  res.json(ps);
});

module.exports = router;
