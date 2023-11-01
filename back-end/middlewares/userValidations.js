const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Insira um email válido"),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres"),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais");
        }
        return true;
      }),
    body("permissionType")
      .isString()
      .notEmpty()
      .withMessage("O tipo de autorização é obrigatória. Default: customer"),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Insira um email válido"),
    body("password").isString().withMessage("A senha é obrigatória."),
  ];
};



module.exports = {
  userCreateValidation,
  loginValidation,
};
