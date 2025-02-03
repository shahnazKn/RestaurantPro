const express = require('express');
const { signin, customerSignup, restaurantOwnerSignup } = require('../controllers/authController');
const router = express.Router();

router.post('/signin', signin);
router.post('/customer/signup', customerSignup);
router.post('/restaurant/signup', restaurantOwnerSignup);

module.exports = router;
