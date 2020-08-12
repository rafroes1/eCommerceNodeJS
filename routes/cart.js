const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");

router.get('/', async (req, res) => {
  let cart = req.session.cart || [];
  console.log(cart.length)
  for (let i = 0; i < cart.length; i++) {
    let product = await Product.findById(cart[i].productId);
    cart[i]['name'] = product.name;
    cart[i]['price'] = product.price;
    cart[i]['shippingCost'] = product.shippingCost;
  }
  res.status(200).json(cart);
});

router.post('/add', async (req, res) => {
  let result = await add(req.session.cart, req.body.productId, req.body.quantities);
  if(result.success)
    req.session.cart = result.cart;

  res.status(result.status).json({
    message: result.message
  });
});

router.post('/checkout', async (req, res) => {
  let userId = req.session.userId || null;
  let cart = req.session.cart;
  if(cart) {
    let result = await checkout(userId, cart, req.body);
    if(result.success)
      delete req.session.cart;

    res.status(result.status).json({
      message: result.message
    });
  } else {
    res.status(400).json({
      message: 'Cart is empty.'
    });
  }
});

router.put('/update', (req, res) => {
  let cart = req.session.cart;
  if(cart) {
    req.body.products.forEach(product => {
      let index = cart.findIndex(item => item.productId === product.productId);
      cart[index].quantities = parseInt(product.quantities);
    });
    req.session.cart = cart;

    res.status(200).json({
      message: 'Cart was updated successfully.'
    });
  } else {
    res.status(400).json({
      message: 'Cart is empty.'
    });
  }
});

router.delete('/remove/:productId', (req, res) => {
  let cart = req.session.cart
  if(cart) {
    let index = cart.findIndex(item => item.productId === req.params.productId);
    if(index >= 0) {
      cart.splice(index, 1);
      req.session.cart = cart;
      res.status(200).json({
        message: 'Product was removed from cart successfully.'
      });
    } else {
      res.status(400).json({
        message: 'Product does not exist in your cart.'
      });
    }
  } else {
    res.status(400).json({
      message: 'Cart is empty.'
    });
  }
});

router.delete('/clear', (req, res) => {
  if(req.session.cart) {
    delete req.session.cart
    res.status(200).json({
      message: 'Cart was cleared successfully.'
    });
  } else {
    res.status(400).json({
      message: 'Cart is empty.'
    });
  }
});

async function add(cart, productId, quantities) {
  let result = {
    cart: [],
    status: 200,
    success: true,
    message: 'A new product was added to cart successfully.'
  };

  let product = await Product.findById(productId).catch(() => {
    result.status = 400;
    result.success = false;
    result.message = 'This product is not exist.';
    return result;
  });

  if(product === null) {
    result.status = 400;
    result.success = false;
    result.message = 'This product is not exist.';
    return result;
  }

  if(quantities <= 0) {
    result.status = 400;
    result.success = false;
    result.message = 'Quantities must greater than 0.';
    return result;
  }

  if(cart) {
    let index = cart.findIndex(e => e.productId === productId);
    if(index >= 0) {
      cart[index].quantities += quantities;
    } else {
      cart.push({productId: productId, quantities: quantities});
    }
  } else {
    cart = [];
    cart.push({productId: productId, quantities: quantities});
  }

  result.cart = cart;
  return result;
}

async function checkout(userId, cart, data) {
  let result = {
    status: 200,
    success: true,
    message: 'Purchased successfully.'
  }

  let coupon = null;
  if(data.couponCode) {
    coupon = await checkCoupon(data.couponCode);
    if(!coupon) {
      result.status = 400;
      result.success = false;
      result.message = 'This coupon code is not valid.';
      return result;
    }
  }

  let cartData = new Cart();
  cartData.userId = userId;
  cartData.fullname = data.fullname;
  cartData.phone = data.phone;
  cartData.address = data.address;
  cartData.products = [];

  if(coupon) {
    cartData.couponId = coupon.id;
    cartData.total = -coupon.value;
  }

  for(item of cart) {
    let product = await Product.findById(item.productId);
    cartData.products.push({
      id: product.id,
      quantities: item.quantities,
      price: product.price,
      shippingCost: product.shippingCost
    });
    cartData.total += product.price * item.quantities + product.shippingCost;
  };

  // save cart
  await cartData.save();

  return result;
}

async function checkCoupon(code) {
  let coupon = Coupon.findOne({code: code, status: 1});
  return coupon;
}

module.exports = router;
