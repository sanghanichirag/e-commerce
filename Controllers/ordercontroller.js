const mysql = require('../Config/Connection')

const msg = require('../msg.json');

function generate10DigitCode() {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 900) + 100;
    const code = `${timestamp}${randomPart}`;
    return code;
}

module.exports.checkOut = async (req, res) => {
    let reqBody = req.body;
    let order_id = generate10DigitCode();
    let Order_Data = {
        user_id: req.user.id,
        order_id: order_id,
        first_name: reqBody.first_name,
        last_name: reqBody.last_name,
        apartment: reqBody.apartment,
        address: reqBody.address,
        phone: reqBody.phone,
        city: reqBody.city,
        state: reqBody.state,
        country: reqBody.country,
        zip_code: reqBody.zip_code,
        total: 0
    }
    await mysql.query(`SELECT a.*, b.price * a.quantity as total_price FROM cart a left join product b on b.id = a.product_id WHERE a.user_id = ${req.user.id}`, async (err, cartData) => {
        let Order_List_Data = [];
        let totalOrderPrice = 0;
        for (let key of cartData) {
            totalOrderPrice += key.total_price
            Order_List_Data.push({
                order_id: order_id,
                product_id: key.product_id,
                qty: key.quantity
            })
        }
        Order_Data.total = totalOrderPrice;
        let Query = 'insert into orders set ?';
        await mysql.query(Query, [Order_Data], async (err, data) => {
            if (err) {
                console.log(err);
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            Query = `insert into order_list (${Object.keys(Order_List_Data[0])}) values ?`
            await mysql.query(Query, [Order_List_Data.map(key => Object.values(key))], async (err, data) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        message: msg.System_error.Something_Went_Wrong_Try_Again,
                        success: false,
                        data: null,
                        status: 500
                    });
                }

                Query = `delete from cart where user_id='${req.user.id}'`;
                mysql.query(Query, (err) => {
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
                        message: msg.CheckOut_success.CheckOut_Added_Successfully,
                        success: true,
                        data: [],
                        status: 200
                    });
                });
            });
        });
    });
}

module.exports.getAllOrdersDetails = async (req, res) => {
    let user_id = req.user.id
    let query = 'select * from orders where user_id = ?';
    await mysql.query(query, user_id, async function (err, data) {
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

module.exports.getSingleOrdersDetails = async (req, res) => {
    let id = req.params.id;
    let query = 'select * from orders where order_id = ?';
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