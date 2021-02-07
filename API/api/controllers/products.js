/*
    We want to export a couple of functions here in the JS files.
    That in the end are the same function that i passed in the route 
*/

const mongoose = require('mongoose');
const Product = require('../models/products'); //Entering the product model files

exports.product_get_all = (req, res, next) => { // Here we are hendaling the GET request
    Product.find()
    .select('_id name price productImage') // Here we are saying what are the data we need to fetch
    .exec() // It is for promice thing
    .then(docs => {
        const response ={
            NoOfData: docs.length, // This property is used for counting the amount of data ( How many datas are there ?)
            product: docs.map(doc => {      // This will print the array of all the products
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            }) 
        }
        // console.log(docs);
        if(docs.length >= 0){
            res.status(200).json(response); // This is used for printing the data
        } else {
            res.status(404).json({
                message: 'No Entries Found'
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
    /*res.status(200).json({
        message: 'Handling GET request to /products'
    });*/
};

exports.product_created = (req, res, next) => { // Here we are hendaling the POST request

    console.log(req.file); // This print out all the detail in the terminal when the picture is uploaded
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    }); // Here we are saying how our data will be submitted and and what are we requesting for

    product
        .save()
        .then(result =>{ // when you get the result then print the result
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
    /* Here we are saving and then also telling them to print the result in 
    console and catch the error and print it in console*/ 
};

exports.product_get_single_product = (req, res, next) => {
    const id = req.params.productId; // Here we are extacting the product ID

    Product.findById(id)
    .select('_id name price productImage')
    .exec()
    .then(doc => { 
        console.log("From Database", doc);
        if (doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost3000/products/' + doc._id
                }
            });
        } else {
            res.status(404).json({message: 'No valid entry found for the provider'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    })

};

exports.product_updated = (req, res, next) => { // This is for Patch Request
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    /* This for loop will iterrate through every variable and in javascript in which you have described
    and the change value in the variable.
    EXAMPLE: 
    [
        {
            "propName": "name", "value": "Tanvir Ahmed"
        }
    ]

    Then it will change the value in the variable.
    */ 

    Product.update({ _id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        // console.log(result);
        res.status(200).json({
            message: 'Product Has Been Updated',
            request: {
                type: 'GET',
                url: 'http://localhost3000/products/' + id
            }
        });
    })
    .catch(err =>{
        console.log(err); // Print what is the error in the terminal
        res.status(500).json({
            error: err
        });
    });
    /* If we wanted we could do this.
    Product.update({_id: id}, {$set: {name: req.body.newName, price: req.body.newPrice}});
    but then the software would assume the everytime we want to change something we need to change both.
    but we dont want that so we need to change that */ 
    
    /*res.status(200).json({
        message: 'Updated Products !'
    });*/
};

exports.product_delete = (req, res, next) => { // This is for Delete Request
    const id = req.params.productId; // Here we are requesting for the ID from the URL
    Product.remove({_id: id}) // Here we are saying that i am going to delete the data which has this ID    
    .exec()
    .then(res => {
        res.status(200).json({
            message: 'Product has been deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/' + id,
                bodyStructure: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });


    /*res.status(200).json({
        message: 'Deleted Products !'
    });*/
};