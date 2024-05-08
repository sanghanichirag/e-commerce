const { check } = module.exports = require("express-validator");
const msg = require('../msg.json')
class Validater {

    constructor() { }
    LoginValidation() {
        return [
            check('email', msg.Validation_error.Enter_Email).not().isEmpty(),
            check('email', msg.Validation_error.Enter_Valid_Email).isEmail(),
            check('password', msg.Validation_error.Enter_Password).not().isEmpty(),
        ];
    }
    UserRegisterValidation() {
        return [
            check('username', msg.Validation_error.Enter_Username).not().isEmpty(),
            check('phone', msg.Validation_error.Enter_Phone).not().isEmpty(),
            check('phone', msg.Validation_error.Enter_Valid_Phone_Number).matches(/^[a-zA-Z0-9]{10}$/, "i"),
            check('email', msg.Validation_error.Enter_Email).not().isEmpty(),
            check('email', msg.Validation_error.Enter_Valid_Email).isEmail(),
            check('password', msg.Validation_error.Enter_Password).not().isEmpty(),
        ];
    }
    ProfileValidation() {
        return [
            check('username', msg.Validation_error.Enter_Username).not().isEmpty(),
            check('email', msg.Validation_error.Enter_Email).not().isEmpty(),
            check('email', msg.Validation_error.Enter_Valid_Email).isEmail(),
        ];
    }
    ProductValidation() {
        return [
            check('name', msg.Validation_error.Enter_Product_Name).not().isEmpty(),
            check('price', msg.Validation_error.Enter_Product_Price).not().isEmpty(),
            check('quantity', msg.Validation_error.Enter_Product_Quantity).not().isEmpty(),
            check('description', msg.Validation_error.Enter_Product_Description).not().isEmpty(),
        ];
    }
}
module.exports = Validater;