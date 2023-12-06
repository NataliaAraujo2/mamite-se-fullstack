const express = require("express");
const router = express.Router();

//Controller
const { insertBillingAddress, insertDeliveryAddress, deleteBillingAddress, deleteDeliveryAddress, getAllUserDeliveryAddress, getUserBillingAddress, getUserbyIdBillingAddress } = require("../controllers/AddressController");

//Middlewares
const {
  billingAddressInsertValidation, deliveryAddressInsertValidation,
} = require("../middlewares/addressValidations");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");

//Routes
router.post("/billing", authGuard, billingAddressInsertValidation(), validate, insertBillingAddress);
router.post("/delivery", authGuard, deliveryAddressInsertValidation(), validate, insertDeliveryAddress);
router.delete("/billing/:id", authGuard, deleteBillingAddress);
router.delete("/delivery/:id", authGuard, deleteDeliveryAddress);
router.get("/user/delivery", authGuard, getAllUserDeliveryAddress);
router.get("/user/billing", authGuard, getUserBillingAddress);
router.get("/user/billing/:id", authGuard, getUserbyIdBillingAddress);


module.exports = router;
