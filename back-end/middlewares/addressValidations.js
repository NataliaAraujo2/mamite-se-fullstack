const { body } = require("express-validator");

const billingAddressInsertValidation = () => {
  return [
    body("billingAddress")
      .isString()
      .withMessage("O campo endereço é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O endereço precisa ter pelo menos 3 caracteres"),
    body("billingNumber").isString().withMessage("O número é obrigatório."),
    body("billingAdditional").isString().optional(),
    body("billingNeighborhood").isString().withMessage("O bairro é obrigatório."),
    body("billingCity").isString().withMessage("A cidade é obrigatória."),
    body("billingState").isString().withMessage("O estado é obrigatório."),
    body("billingZipCode").isString().withMessage("O CEP é obrigatório.").isLength({min:8, max:8}).withMessage("O CEP precisa ter 8 caracteres."),
  ];
};

const deliveryAddressInsertValidation = () => {
  return [
    body("deliveryAddress")
      .isString()
      .withMessage("O campo endereço é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O endereço precisa ter pelo menos 3 caracteres"),
    body("deliveryNumber").isString().withMessage("O número é obrigatório."),
    body("deliveryAdditional").isString().optional(),
    body("deliveryNeighborhood").isString().withMessage("O bairro é obrigatório."),
    body("deliveryCity").isString().withMessage("A cidade é obrigatória."),
    body("deliveryState").isString().withMessage("O estado é obrigatório."),
    body("deliveryZipCode").isString().withMessage("O CEP é obrigatório.").isLength({min:8, max:8}).withMessage("O CEP precisa ter 8 caracteres."),
  ];
};

const addressUpdateValidation = () => {
  return [
    body("address")
      .optional()
      .isString()
      .isLength({ min: 3 })
      .withMessage("O endereço precisa ter pelo menos 3 caracteres"),
    body("number").optional().isString(),
    body("additional").isString().optional(),
    body("neighborhood")
      .optional()
      .isString()
      .withMessage("O bairro é obrigatório."),
    body("city").isString().optional(),
    body("state").isString().optional(),
    body("zipCode")
      .isString()
      .isLength(8)
      .optional(),
  ];
};

module.exports = {
  billingAddressInsertValidation,
  deliveryAddressInsertValidation,
  addressUpdateValidation,
};
