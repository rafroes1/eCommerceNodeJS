const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get('/', (req, res) => {
  let status = req.session.userId !== undefined ? 200 : 401;
  let isLoggedIn = req.session.userId !== undefined;
  res.status(status).json({
    isLoggedIn: isLoggedIn
  });
});

router.post('/login', async (req, res) => {
  let status = 200,
  data = {
    isLoggedIn: true,
    message: 'Login successfuly.'
  };

  if(req.body.email !== undefined && req.body.password !== undefined) {
    let user = await User.findOne({email: req.body.email});
    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        req.session.userId = user.id;
      } else {
        status = 401;
        data.isLoggedIn = false;
        data.message = 'Wrong password.';
      }
    } else {
      status = 401;
      data.isLoggedIn = false;
      data.message = 'Account does not exist.';
    }
  } else {
    status = 401;
    data.isLoggedIn = false;
    data.message = 'Please input email and password.';
  }

  res.status(status).json(data);
});

router.delete('/logout', (req, res) => {
  delete req.session.userId
  res.status(200).json({
    isLoggedIn: false
  });
});

module.exports = router;
