/*
    We want to export a couple of functions here in the JS files.
    That in the end are the same function that i passed in the route 
*/

const mongoose = require('mongoose');
const Order = require('../models/orders'); // Entering the order files
const Product = require('../models/products'); //Entering the product model files

exports.orders_get_all = (req, res, next) => {

    Order
        .find()
        .select('_id quantity product')
        .populate('product', 'name') // Here we are saying that we want to populate the product and in the product we want to populate the name
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        productId: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' +doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({error: err});
        }); 
};

exports.orders_create_order = (req, res, next) => {
    
    Product
        .findById(req.body.productId)
        .then(product => {
            if (!product) {  // Here if the productId is not found then return the 404 (Product not found) then rest of the product will not be executed. If it is there then the rest of the product will exected
                return res.status(404).json({
                    message: 'Product Not found'
                });
            }
            const order = new Order({ // Here we are using our model as a constructor and then set the javascript object where we can configure it.
                _id: mongoose.Types.ObjectId(), //Here we are executing a function where we genarate an ID.
                quantity: req.body.quantity,
                product: req.body.productId // Here we are expecting to get a product ID
            });
            return order.save()
        })
        .then(result => { // when you get the result then print the result
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder:{
                    _id: result._id,
                    productId: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' +result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Product not found'
            });
        });

    // res.status(201).json({
    //     message: 'Your order is been POSTed',
    //     order: order
    // });
};

exports.orders_get_single_order = (req, res, next) => {
   
    Order
    .findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order){  // Here we are saying that if the order is not found then return 404
            return res.status(404).json({
                message: 'Order Not Found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: "http://localhost:3000/orders/"
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.orders_delete = (req, res, next) => {

    Order
        .remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order has been deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number'} 
                }
            })
            

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};