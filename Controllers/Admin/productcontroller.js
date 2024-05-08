const moment = require('moment/moment');
const mysql = require('../../Config/Connection')

const msg = require('../../msg.json');
const fs = require('fs');
const path = require('path');

const deleteFile = (files) => {
    const filePath = path.join('./assets/Images/Product/' + files);
    fs.unlink(filePath, async (err) => {
        if (err) throw err;
        console.log(`${files} was deleted`);
    });
};

module.exports.Add = async (req, res) => {
    let ReqBody = req.body;
    let images = [];
    if (req.files[0]) {
        for (const key in req.files) {
            images.push(req.files[key].filename)
        }
        let ProductInsertData = {
            name: ReqBody.name,
            price: ReqBody.price,
            quantity: ReqBody.quantity,
            description: ReqBody.description,
            images: JSON.stringify(images)
        }
        let Query = `insert into product set ?`;
        await mysql.query(Query, ProductInsertData, async (err, data) => {
            if (err) {
                console.log(err);
                for (const key in images) {
                    deleteFile(images[key])
                }
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            return res.send({
                message: msg.Product_success.Product_Added_Successfully,
                success: true,
                data: [],
                status: 200
            });
        });
    }

}
module.exports.GetAll = async (req, res) => {
    let Query = 'select * from product';
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
        for (const key in data) {
            let ImageUrlData = JSON.parse(data[key].images);
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
            status: 200
        });
    })
}

module.exports.GetSingle = async (req, res) => {
    let id = req.params.id;
    let Query = `Select * from product where id=${id}`;
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
        for (const key in data) {
            let ImageUrlData = JSON.parse(data[key].images);
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
            status: 200
        });
    })
}

module.exports.delete = async (req, res) => {
    let id = req.params.id;
    let Query = `select * from product where id='${id}'`;
    mysql.query(Query, async (err, ProductData) => {
        if (err) {
            console.log(err);
            return res.send({
                message: msg.System_error.Something_Went_Wrong_Try_Again,
                success: false,
                data: null,
                status: 500
            });
        }
        if (ProductData[0]) {
            let Images = JSON.parse(ProductData[0].images);
            for (const key in Images) {
                deleteFile(Images[key]);
            }
        }
        Query = `delete from product where id=${id}`;
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
                message: msg.Product_success.Product_Deleted_Successfully,
                success: true,
                data: [],
                status: 200
            });
        })
    });
}

module.exports.update = async (req, res) => {
    let ReqBody = req.body;
    let images = [];
    let id = ReqBody.id;
    let ProductInsertData = {};
    let Query = "";
    if (req.files[0]) {
        for (const key in req.files) {
            images.push(req.files[key].filename)
        }
        ProductInsertData = {
            name: ReqBody.name,
            price: ReqBody.price,
            quantity: ReqBody.quantity,
            description: ReqBody.description,
            images: JSON.stringify(images)
        }
        Query = `select * from product where id='${id}'`;
        mysql.query(Query, async (err, DataForImages) => {
            if (err) {
                console.log(err);
                return res.send({
                    message: msg.System_error.Something_Went_Wrong_Try_Again,
                    success: false,
                    data: null,
                    status: 500
                });
            }
            if (DataForImages[0]) {
                let Images = JSON.parse(DataForImages[0].images);
                for (const key in Images) {
                    deleteFile(Images[key]);
                }
            } else {
                for (const key in images) {
                    deleteFile(images[key]);
                }
            }
            Query = `update product set ? where id=${id}`;
            await mysql.query(Query, ProductInsertData, (err, data) => {
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
                    message: msg.Product_success.Product_Updated_Successfully,
                    success: true,
                    data: [],
                    status: 200
                });
            })
        })
    } else {
        ProductInsertData = {
            name: ReqBody.name,
            price: ReqBody.price,
            quantity: ReqBody.quantity,
            description: ReqBody.description
        }
        Query = `update product set ? where id=${id}`;
        await mysql.query(Query, ProductInsertData, (err, data) => {
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
                message: msg.Product_success.Product_Updated_Successfully,
                success: true,
                data: [],
                status: 200
            });
        })
    }
}
