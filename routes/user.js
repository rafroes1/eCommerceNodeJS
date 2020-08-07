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

router.post('/create-account', async (req, res) =>{
  let email = req.body.email;
  let password = req.body.password;
  let fullname = req.body.fullname;
  let phone = req.body.phone;
  let address = req.body.email;

  if( email !== undefined && password !== undefined && fullname !== undefined && phone !== undefined && address !== undefined){
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    let user = new User();
    user.email = email;
    user.password = hash;
    user.fullname = fullname;
    user.phone = phone;
    user.address = address;
    await user.save();
    res.status(200).json({
      message: 'Account was successfully created.'
    }); 
  }else {
      res.status(400).json({
        message: 'Missing parameters.'
      });
  }
});

router.post('/update-account', async (req, res) =>{
  let userId = req.session.userId;
  if(userId){
    let user = await User.findById(userId);
    if(req.body.email !== undefined){
      user.email = req.body.email;
    }
    if(req.body.fullname !== undefined){
      user.fullname = req.body.fullname;
    }
    if(req.body.phone !== undefined){
      user.phone = req.body.phone;
    }
    if(req.body.address !== undefined){
      user.address = req.body.address;
    }
        await user.save();
        res.status(200).json({
          message: 'Account was successfully updated.'
        });
  }else {
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

module.exports = router;
