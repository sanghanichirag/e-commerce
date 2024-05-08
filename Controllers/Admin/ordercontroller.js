const mysql = require('../../Config/Connection');

const msg = require('../../msg.json');

module.exports.getAllOrdersDetails = async (req, res) => {
    let query = 'select * from orders';
    await mysql.query(query, async function (err, data) {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        } else {
            for (let i in data) {
                let orderData = await new Promise(async resolve => {
                    query = ` select * from order_list where order_id = ${data[i].order_id} `;
                    await mysql.query(query, async function (err, orderData) {
                        if (err) {
                            console.log(err);
                            return res.send({
                                message: msg.System_error.Something_Went_Wrong_Try_Again,
                                success: false,
                                data: null,
                                status: 500
                            });
                        } else {
                            resolve(orderData)
                        }
                    });
                })
                data[i].product = orderData;
            }
            return res.send({
                message: msg.CheckOut_success.Data_Fetch_Successfully,
                success: true,
                data: data,
                status: 200
            });
        }
    });
}

module.exports.getSingleUserOrdersDetails = async (req, res) => {
    let id = req.params.id;
    let query = 'select * from orders where user_id = ?';
    await mysql.query(query, id, async function (err, data) {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        } else {
            for (let i in data) {
                let orderData = await new Promise(async resolve => {
                    query = ` select * from order_list where order_id = ${data[i].order_id} `;
                    await mysql.query(query, async function (err, orderData) {
                        if (err) {
                            console.log(err);
                            return res.send({
                                message: msg.System_error.Something_Went_Wrong_Try_Again,
                                success: false,
                                data: null,
                                status: 500
                            });
                        } else {
                            resolve(orderData)
                        }
                    });
                })
                data[i].product = orderData;
            }
            return res.send({
                message: msg.CheckOut_success.Data_Fetch_Successfully,
                success: true,
                data: data,
                status: 200
            });
        }
    });
}

module.exports.UpdateOrderStatus = async (req, res) => {
    let id = req.body.id;
    let statusData = {
        status: req.body.status
    }
    let query = `update orders set ? where user_id='${id}'`;
    await mysql.query(query, statusData, async function (err, data) {
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
            message: msg.Product_success.Order_Status_Updated_Successfully,
            success: true,
            data: data,
            status: 200
        });
    });
}