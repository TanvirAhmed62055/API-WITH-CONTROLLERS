//  In this file we are making product related routes

const express = require('express');
const router = express.Router();

const multer = require('multer');

const checkAuth = require('../middleware/check-auth'); // Importing the middleware (check-auth)


const storage = multer.diskStorage({ // This line is for storage strategy
    destination: function(req, file, cb){
        cb(null, './uploads/'); // The null is for potential error we want to write one. we can write it but we wont do it here so will keep it as null
        // Here we are also saying that. Here is the destination file. 
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString + file.originalname); 
        /* Here in the second parameter we are what is the file name should be while storing it.
        So, Here the filename is set at the 'date + ISOname in Strings + orginal file name' */
    }
});


const fileFilter = (req, file, cb) => {  // At this function we are sitting up a filter for the images to store
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); // This line will store the file. If the condition is true.
    } else {
        var message = "This file does not meet our criteria. Please upload jpeg or png files under 5MB"
        cb(new Error(message), false); 
        /* This file will ignore uploading the file if it is not true.
        But we will put the error message in the first parameter */
    }
};


const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); 


// This folder is not publically accessable by people but changed to global or satic folder later on 'app.js' to access  
/* In the line above we can change the configaration up here. when we initailiza multer.
We can be  more detailed here and define how we want to store that file.
We can also make sure that we only store certian types of file.*/

const Product = require('../models/products');
// const router = express.Router(); 
/* express route is like a sub package from express framework which ships with that and gives us 
different capabilites which conviniently handles different roughts, endpoints with different HTTP words*/


const ProductController = require('../controllers/products'); // Importing Product Controller

router.get('/', ProductController.product_get_all);

router.post('/',checkAuth , upload.single('productImage') , ProductController.product_created);

/* >>>>>    Here are making for an individual products     <<<<<<*/
router.get('/:productId', ProductController.product_get_single_product); 

router.patch('/:productId',checkAuth , ProductController.product_updated);

router.delete('/:productId', checkAuth , ProductController.product_delete);


module.exports = router; // so that the router that we configured is exported and can be used in the app.js file.