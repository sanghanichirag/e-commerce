const mysql = require('../Config/Connection')

const msg = require('../msg.json');

const jwt = require('jsonwebtoken');

const jwt_secret = 'Admin_Login_jwt_secret';

const path = require('path');

const fs = require('fs');

const bcrypt = require('bcrypt');

const deleteFile = (files) => {
    const filePath = path.join('./assets/Images/AdminProfile/' + files);
    fs.unlink(filePath, async (err) => {
        if (err) throw err;
        console.log(`${files} was deleted`);
    });
};

const url = `${process.env.IMAGE_BASE_URL}Images/AdminProfile/`;

const nodemailer = require('nodemailer');

const otpGenerator = require('otp-generator');

module.exports.Login = async (req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
    });
    let GetData = `select * from admin where email='${email}'`;
    await mysql.query(GetData, async (err, data) => {
        if (err) {
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        if (data[0] === '' || data[0] === null || data[0] === undefined) {
            return res.send({
                message: msg.Admin_Validation_error.Enter_Valid_Email,
                success: false,
                data: null,
                status: 400
            });
        }
        else {
            const storedHashedPassword = data[0].password;
            bcrypt.compare(password, storedHashedPassword, async (err, result) => {
                if (err) {
                    console.error(err);
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                } else if (result) {
                    const payload = {
                        id: data[0].id
                    }
                    let token = jwt.sign(payload, jwt_secret, { expiresIn: '365d' });
                    data[0].profile_image = url + data[0].profile_image;

                    mysql.query(`update admin set ? where id='${data[0].id}'`, { auth_token: token }, (err) => {
                        if (err) {
                            console.error(err);
                            return res.send({
                                message: msg.System_error.Something_Went_Wrong_Try_Again,
                                success: false,
                                data: null,
                                status: 500
                            });
                        }
                    });
                    return res.send({
                        message: msg.Admin_success.Login_Successfully,
                        success: true,
                        data: { data: data[0], authToken: token },
                        status: 200
                    });
                } else {
                    return res.send({
                        message: msg.Admin_Validation_error.Enter_Valid_Password,
                        success: false,
                        data: null,
                        status: 400
                    });
                }
            });
        }
    });
}

module.exports.getadminData = async (req, res) => {
    let id = req.user.id;
    if (id == '' || id == null || id == undefined) {
        return res.send({
            message: msg.System_error.Something_Went_Wrong_Try_Again,
            success: false,
            data: null,
            status: 500
        });
    }
    else {
        let getAdminData = `select * from admin where id='${id}' `;
        await mysql.query(getAdminData, async (err, data) => {
            if (err) {
                console.log(err);
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            if (data[0] === undefined || data[0] === null || data[0] === '') {
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            else {
                if (data[0].profile_image) {
                    data[0].profile_image = url + data[0].profile_image;
                }
                delete data[0].password;
                return res.send({
                    message: null,
                    success: true,
                    data: data[0],
                    status: 200
                });
            }
        });
    }
}

module.exports.forgetPasswordEmail = async (req, res) => {
    let email = req.body.email;
    let getData = `select * from admin where email='${email}'`;
    await mysql.query(getData, async (err, data) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        if (data[0] === null || data[0] === undefined || data[0] === '') {
            return res.send({
                message: msg.Admin_Validation_error.Enter_Valid_Email,
                success: false,
                data: null,
                status: 400
            });
        }
        else {
            const otpCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'prince.artbees@gmail.com',
                    pass: 'jfmwkoiycrrcwssk'
                }
            });
            const emailContent = `<p>Hi there,</p>
                                        <p>Your OTP code is <strong>${otpCode}</strong>.</p>
                                        <p>Please use this code to verify your identity.</p>`;
            transporter.sendMail({
                from: 'prince.artbees@gmail.com',
                to: email,
                subject: 'OTP Verification Code',
                html: emailContent
            }, async (err, info) => {
                if (err) {
                    console.log('Error occurred:', err.message);
                    return process.exit(1);
                }

                mysql.query(`update admin set ? where email='${email}'`, { otp: otpCode }, (err) => {
                    if (err) {
                        console.log(err);
                        return res.send({
                            message: msg.System_error.Something_Went_Wrong_Try_Again,
                            success: false,
                            data: null,
                            status: 500
                        });
                    }
                    return res.send({
                        message: msg.Admin_success.Otp_Send_Successfully,
                        success: true,
                        data: { email: email },
                        status: 200
                    });
                });
            });
        }
    })
}

module.exports.OtpVerification = async (req, res) => {
    let { email, Input_Otp } = req.body;

    let Query = `select otp from admin where email='${email}'`;
    mysql.query(Query, (err, OtpData) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        if (OtpData[0]) {
            if (OtpData[0].otp == Input_Otp) {
                Query = `update admin otp set ? where email='${email}'`;
                mysql.query(Query, { otp: "Verified" }, (err) => {
                    if (err) {
                        console.log(err);
                        return res.send({
                            message: msg.System_error.Something_Went_Wrong_Try_Again,
                            success: false,
                            data: null,
                            status: 500
                        });
                    }
                    return res.send({
                        message: msg.Admin_success.Otp_Verification_Successfully,
                        success: true,
                        data: null,
                        status: 200
                    });
                });
            }
            else {
                return res.send({
                    message: msg.Admin_Validation_error.Enter_Valid_OTP,
                    success: false,
                    data: null,
                    status: 400
                });
            }
        } else {
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 200
            });
        }
    });
}

module.exports.forgetpasswordMain = async (req, res) => {
    let email = req.body.email;
    let { password, c_password } = req.body;
    if (email === '' || email === null || email === undefined) {
        return res.send({
            message: msg.System_error.Something_Went_Wrong_Try_Again,
            success: false,
            data: null,
            status: 500
        });
    }
    else {
        mysql.query(`select otp from admin where email='${email}'`, async (err, CheckOtpVerified) => {
            if (err) {
                console.log(err);
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            if (CheckOtpVerified[0]) {
                if (CheckOtpVerified[0].otp == "Verified") {
                    if (password === c_password) {
                        const saltRounds = 10;
                        const salt = bcrypt.genSaltSync(saltRounds);
                        password = bcrypt.hashSync(password, salt);
                        let Forget_Password_Query = `update admin set password='${password}',otp='${null}' where email='${email}'`;
                        await mysql.query(Forget_Password_Query, async (err, data) => {
                            if (err) {
                                console.log(err);
                                return res.send({
                                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                                    success: false,
                                    data: null,
                                    status: 500
                                });
                            }
                            return res.send({
                                message: msg.Admin_success.PassWord_Forget_Successfully,
                                success: true,
                                data: null,
                                status: 200
                            });
                        });
                    }
                    else {
                        return res.send({
                            message: msg.Admin_Validation_error.Password_And_C_Password_not_Match,
                            success: false,
                            data: null,
                            status: 400
                        });
                    }
                } else {
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                }
            } else {
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
        });
    }
}

module.exports.ChangePassword = async (req, res) => {
    let { old_password, new_password, new_c_password, email } = req.body;
    const saltRounds = 10;
    if (new_password === new_c_password) {
        if (email === null || email === undefined || email === '') {
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        else {
            let getData_Query = `select * from admin where email='${email}'`
            await mysql.query(getData_Query, async (err, data) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                }
                if (data[0] === null || data[0] === undefined || data[0] === '') {
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                }
                else {
                    const storedHashedPassword = data[0].password;
                    bcrypt.compare(old_password, storedHashedPassword, async (err, result) => {
                        if (err) {
                            console.error(err);
                            return res.send({
                                message: msg.System_error.Something_Went_Wrong_Try_Again,
                                success: false,
                                data: null,
                                status: 500
                            });
                        } else if (result) {
                            const saltRounds = 10;
                            const salt = bcrypt.genSaltSync(saltRounds);
                            new_password = bcrypt.hashSync(new_password, salt);
                            let Update_Query = `update admin set password='${new_password}' where email='${email}'`;
                            await mysql.query(Update_Query, async (err, up_data) => {
                                if (err) {
                                    console.log(err);
                                    return res.send({
                                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                                        success: false,
                                        data: null,
                                        status: 500
                                    });
                                }
                                return res.send({
                                    message: msg.Admin_success.PassWord_Change_Successfully,
                                    success: true,
                                    data: null,
                                    status: 200
                                });
                            });
                        } else {
                            return res.send({
                                message: msg.Admin_Validation_error.Enter_Valid_Password,
                                success: false,
                                data: null,
                                status: 400
                            });
                        }
                    });
                }
            });
        }
    }
    else {
        return res.send({
            message: msg.Admin_Validation_error.New_Password_And_New_C_Password_not_Match,
            success: false,
            data: null,
            status: 400
        });
    }
}

module.exports.Log_Out = async (req, res) => {
    let id = req.user.id;
    let Query = `update admin set ? where id='${id}'`;
    mysql.query(Query, { auth_token: null }, (err) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        return res.send({
            message: msg.Admin_success.Log_Out_Successfully,
            success: true,
            data: null,
            status: 200
        });
    });
}