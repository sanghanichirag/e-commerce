const mysql = require('../Config/Connection')

const msg = require('../msg.json');

module.exports.Add = async (req, res) => {
    let InsertData = {
        user_id: req.user.id,
        product_id: req.body.product_id
    }
    let Query = `select * from product where id='${InsertData.product_id}'`;
    mysql.query(Query, (err, CheckData) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        if (CheckData[0]) {
            Query = `select * from cart where user_id='${InsertData.user_id}' and product_id='${InsertData.product_id}'`;
            mysql.query(Query, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                }
                if (data[0]) {
                    return res.send({
                        message: msg.Add_To_Cart_Validation_error.Add_To_Cart_Already_Exists,
                        success: true,
                        data: [],
                        status: 200
                    });
                } else {
                    Query = `insert into cart set ?`;
                    mysql.query(Query, InsertData, (err) => {
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
                            message: msg.Add_To_Cart_success.Add_To_Cart_Added_Successfully,
                            success: true,
                            data: [],
                            status: 200
                        });
                    });
                }
            });
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
module.exports.GetAll = async (req, res) => {
    let Query = `select a.id as cart_id, a.quantity as cart_quantity, b.* from cart a left join product b on a.product_id = b.id where a.user_id='${req.user.id}'`;
    await mysql.query(Query, (err, data) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        let totalQuantity = 0;
        for (const key in data) {
            totalQuantity += data[key].quantity
            let ImageUrlData = JSON.parse(data[key].images) || [];
            let ImageDataFullUrl = [];
            for (let key2 of ImageUrlData) {
                key2 = process.env.IMAGE_BASE_URL + 'Images/Product/' + key2;
                ImageDataFullUrl.push(key2)
            }
            data[key].images = ImageDataFullUrl;
        }
        return res.send({
            message: null,
            success: true,
            data: data,
            totalQuantity: totalQuantity,
            status: 200
        });
    })
}
module.exports.Delete = async (req, res) => {
    let id = req.params.id;
    let Query = `delete from cart where id=${id}`;
    await mysql.query(Query, (err, data) => {
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
            message: msg.Add_To_Cart_success.Add_To_Cart_Deleted_Successfully,
            success: true,
            data: [],
            status: 200
        });
    });
}
module.exports.update = async (req, res) => {
    let reqBody = req.body;
    if (reqBody.quantity == 0) {
        let Query = `delete from cart where id=${reqBody.id}`;
        await mysql.query(Query, (err, data) => {
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
                message: msg.Add_To_Cart_success.Add_To_Cart_Deleted_Successfully,
                success: true,
                data: [],
                status: 200
            });
        })
    } else {
        let Query = `update cart set quantity = ${reqBody.quantity} where id=${reqBody.id}`;
        await mysql.query(Query, (err, data) => {
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
                message: msg.Add_To_Cart_success.Add_To_Cart_Updated_Successfully,
                success: true,
                data: [],
                status: 200
            });
        })
    }
}