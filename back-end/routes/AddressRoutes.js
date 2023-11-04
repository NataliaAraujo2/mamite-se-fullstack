const express = require("express");
const router = express.Router();

//Controller
const { insertBillingAddress, insertDeliveryAddress, deleteBillingAddress, deleteDeliveryAddress } = require("../controllers/AddressControler");

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

module.exports = router;
