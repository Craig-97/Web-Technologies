/*jslint node: true */
'use strict';

var config          = require('./config')
var express         = require('express');
var api             = express.Router();
var _               = require('underscore');
var moment          = require('moment');
var sendgrid        = require('sendgrid')(config.SENDGRID_API);
var mail            = require('@sendgrid/mail');

var Product         = require('./models/product');
var Customer        = require('./models/customer');
var Purchase        = require('./models/purchase');

//set api key for stock mail alert
mail.setApiKey(config.SENDGRID_API);

api.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


api.route('/products/')

    // get all the products (accessed at GET /api/products)
    .get(function(req, res) {
        Product.find({}, function(err, products) {
            if (err) throw err;

            var productsMap = {};
            products.forEach(function(product) {
                productsMap[product._id] = product;
            })

            res.json(productsMap);
        })
    })

    // create a product (accessed at POST /api/products)
    .post(function(req, res) {
        var product = new Product(req.body);
        product.save(function(err, product) {
            if (err) throw err;
            res.json({'status':'created', 'product': product});
        })
    });


api.route('/products/:id')

    // get the product with this id (accessed at GET /api/products/:id)
    .get(function(req, res) {
        Product.findById(req.params.id, function(err, product) {
            if (err) throw err;
            res.json(product);
        })
    })

    // update the product with this id (accessed at PUT /api/products/:id)
    .put(function(req, res) {
        Product.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, product) {
            if (err) throw err;
            res.json({'status':'updated', 'product': product});
        });
    })

    // delete the product with this id (accessed at DELETE /api/products/:id)
    .delete(function(req, res) {
        Product.findByIdAndRemove(req.params.id, function(err) {
            if (err) throw err;
            console.log('Removed', req.params.id);

            res.json({'status':'removed'});
        });
    });

// get/find stock with low quantity and issue mail alert
api.route('/stock/')
    .get(function(req, res) {
        console.log("Checking Stock Quantity");
        Product.find({ quantity:1 }, function(err, products) {
            if (err) throw err;

            const msg = {
                to: 'craigbaxter97@hotmail.com',
                from: 'eoschazmr@gmail.com',
                subject: 'Low Stock Alert',
                text: 'The following items are Low on stock ',
                html: '<br><br><ul>',
            };
                products.forEach(function(product) {
                msg.html += '<li><a href="http://localhost:3010/#/product/'+product._id+'/ "> Product Name: '+product.name+'<br>Brand: '+product.brand+'<br>Description: '+product.desc+'<br>Price: £'+product.price+'<br>Quantity: '+product.quantity+' </a></li>';
          
            });
 
            msg.html += '</ul>'
            console.log(msg);

            mail.send(msg, false, function(err, result) {
                if(err) {
                    //console.error(err);
                    console.log("error");
                } else {
                    console.log("Mail sent");
                }
            });

            res.json(products);
        });
    });

//get customers
api.route('/customers/')
    .get(function(req, res) {
        Customer.find({}, function(err, customers) {
            if (err) throw err;

            res.json(customers);
        });
    });


//get year report on purchases
api.route('/year-report/')
    .get(function(req, res) {
        var start = moment().startOf('year').toDate();
        var end = moment().startOf('month').toDate();

        Purchase.aggregate({
            $match: {
                date : { $lt: end, $gt: start }
            }
        },{
            $group: {
                _id:   { month: {$month: '$date' }, year: {$year: '$date' }},
                total: { $sum: '$total' },
                items: { $sum: { $size: '$products' }}
            }
        }).sort({'_id.month': 1}).exec(function(err, report) {
            if (err) throw err;

            report = _.map(report, function(d) {
                return {
                    Month: d._id.month,
                    Total: d.total,
                    Items: d.items
                };
            });

            res.json(report);
        });
    });

//get 30-day report on purchases
api.route('/30-day-report/')
    .get(function(req, res) {
        var start = new Date();
        var end = moment().startOf('month').toDate();
        var end = moment().subtract(30, 'day').toDate();

        Purchase.aggregate({
            $match: {
                date : { $lt: start, $gt: end }
            }
        },{
            $group: {
                _id:   { day: {$dayOfMonth: '$date'}, month: {$month: '$date' }, year: {$year: '$date' }},
                total: { $sum: '$total' },
                items: { $sum: { $size: '$products' }}
            }
        }).sort({'_id.month': 1, '_id.day': 1}).exec(function(err, report) {
            if (err) throw err;

            var report = _.map(report, function(d) {
                return {
                    Date: d._id.year+'/'+d._id.month+'/'+d._id.day,
                    Total: d.total,
                    Items: d.items
                };
            });

            res.json(report);
        });
    });


module.exports = api;
