#! /usr/bin/env node

console.log('This script populates some test products, customers and purchases to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://localhost')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Product = require('./models/product')
var Customer = require('./models/customer')
var Purchase = require('./models/purchase')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var customers = []
var products = []
var purchases = []

function customerCreate(firstName, lastName, loyaltyNum, cb) {
    customerdetail = {firstName:firstName, lastName:lastName, loyaltyNum:loyaltyNum}
  
  var customer = new Customer(customerdetail);
       
  customer.save(function (err) {
    if (err) {
    console.log('ERROR CREATING Customer: ' + customer);
      cb(err, null)
      return
    }
    console.log('New Customer: ' + customer);
    customers.push(customer)
    cb(null, customer)
  }  );
}


function productCreate(name, desc, brand, price, quantity, delivery,promo,loyaltyPromo, cb) {
  productdetail = { 
    name : name,
    desc : desc,
    brand : brand,
    price : price,
    quantity : quantity,
    delivery : delivery,
    promo : promo,
    loyaltyPromo: loyaltyPromo
  }
    
  var product = new Product(productdetail);    
  product.save(function (err) {
    if (err) {
        console.log('ERROR CREATING Product: ' + product);
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}


function purchaseCreate(customer, date, total, products, branch, cb) {
  purchasedetail = { 
    customer: customer,
    date: date,
    total: total,
    products: products,
    branch: branch
  }    
  if (date != false) purchasedetail.due_back = date
    
  var purchase = new Purchase(purchasedetail);    
  purchase.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Purchase: ' + purchase);
      cb(err, null)
      return
    }
    console.log('New Purchase: ' + purchase);
    purchases.push(purchase)
    cb(null, purchase)
  }  );
}


function createCustomers(cb) {
    async.parallel([
        function(callback) {
        customerCreate('Zac', 'Dougherty', 101, callback);
        },
        function(callback) {
        customerCreate('Ben', 'Bova', 102, callback);
        },
        function(callback) {
        customerCreate('Isaac', 'Asimov', 103, callback);
        },
        function(callback) {
        customerCreate('Bob', 'Billings', 104, callback);
        },
        function(callback) {
        customerCreate('Jim', 'Jones', 105, callback);
        }
        ],
        // optional callback
        cb);
}


function createProducts(cb) {
    async.parallel([
        function(callback) {
        productCreate('LED PIR Floodlight - Black','A powerful slimline floodlight with long life and a Passive Infra-Red (PIR) sensor which is ideal for outdoor use around your home','Yale',16,8, 3.99,'Buy one get one free','up to 5% discount', callback);
        },
        function(callback) {
        productCreate('Angled Desk Lamp - Soft Grey','The angle desk lamp will keep your office looking smart, it features a lever arm and adjustable head','Homebase',15.99,5,0,'Free Delivery','No Loyaltys', callback);
        },
        function(callback) {
        productCreate('7X5 Overlap Wooden Shed','This overlap pent shed is ideal for general storage use. The pent roof is designed to provide generous headroom inside the shed, and is sloped to allow rain water to run off the back','Forest Pent',254,1,0,'Free Delivery','up to 10% discount', callback);
        },
        function(callback) {
        productCreate('Wood Effect Garden Storage Box','The wood effect finish blends in well with the garden surroundings, Sturdy interior supports prevent the lid from flipping open too far, Lockable lid that can be secured with a padlock (sold separately), Anti rust & UV treated','Hollywood',20,30,5.99,'3 for 2','up to 5% discount', callback);
        },
        function(callback) {
        productCreate('Stainless Steel Splashback','Great for protecting your walls from splashes and for keeping your kitchen clean and hygienic, this splashback from Designair range will give a great finishing touch to your kitchen. Its made from stainless steel so it is incredibly sturdy and hardwearing','B&Q',54,50,9.99,'3 for 2','up to 10% discount', callback)
        }
        ],
        // optional callback
        cb);
}


function createPurchases(cb) {
    async.parallel([
        function(callback) {
          purchaseCreate(customers[0], "2017-10-14T10:13:00Z", 39.92, [products[0],products[1]],'Glasgow1', callback)
        },
        function(callback) {
            purchaseCreate(customers[1], "2017-07-08T17:18:22Z", 3289.45, products[3],'Glasgow3', callback)
        },
        function(callback) {
            purchaseCreate(customers[2], "2017-11-12T15:10:04Z", 19.97, products[1],'Glasgow1', callback)
        },
        function(callback) {
            purchaseCreate(customers[3], "2017-05-18T10:17:26Z", 2899.83, [products[2],products[1]],'Glasgow1', callback)
        },
        function(callback) {
            purchaseCreate(customers[4], "2017-04-10T08:08:43Z", 16, products[4],'Edinburgh2', callback)
        },
        function(callback) {
            purchaseCreate(customers[3], "2017-09-19T19:13:56Z", 2539.92, [products[0],products[1]],'Glasgow1', callback)
        },
        function(callback) {
            purchaseCreate(customers[4], "2017-03-01T11:42:08Z", 2642.40, products[4],'Aberdeen1', callback)
        },
        function(callback) {
            purchaseCreate(customers[2], "2017-11-13T09:26:00Z", 16, products[4],'Glasgow3', callback)
        },
        function(callback) {
            purchaseCreate(customers[4], "2017-11-13T15:43:00Z", 289, products[3],'Aberdeen1', callback)
        },
        function(callback) {
            purchaseCreate(customers[0], "2017-02-01T18:18:00Z", 35.96, [products[1],products[5]],'Edinburgh1', callback)
        },
        function(callback) {
            purchaseCreate(customers[1], "2017-03-08T12:13:00Z", 79.86, products[2],'Glasgow3', callback)
        }
        ],
        // optional callback
        cb);
}



async.series([
    createCustomers,
    createProducts,
    createPurchases
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Purchases: '+purchases);
        
    }
    //All done, disconnect from database
    mongoose.connection.close();
});




