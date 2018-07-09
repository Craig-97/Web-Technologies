Software Architecture Coursework
======

## Description

A nationwide retailing corporation (such as Homebase http://www.homebase.co.uk/ or B&Q http://www.diy.com/) is planning to develop a new distributed store management system for their retail branches to provide better coordination of their business.  It has named the proposed system DE-Store. 

Your company want to pitch for the software development contract and plan to do this by developing a software prototype of an architecture that you believe would show that you could meet the needs of the project.

DE-Store is NOT an online shopping system; instead it is a DISTRIBUTED business management system. Similar Off-The-Shelf products include: Microsoft Dynamics GP (http://www.microsoft.com/en-us/dynamics/erp-gp-overview.aspx) and SAGE (http://www.sage.com/yourbusiness/productsandservices). Both of them may give you an overview taste and the reasons why a bespoke system is preferable. 

DE-Store aims to have a suite of store management functionalities such as price control, inventory control, delivery charge, approval of financial support, and performance analysis. 

•	Price Control: DE-Store allows the store manager to set the price of the products and to select products on a variety of sale offers, which include 3 for 2, buy one get one free, free delivery charges.

•	Inventory Control: stock is monitored all the time by uploading data from the warehouse database. Items out of stock will be ordered from the central inventory system at the headquarters. DE-Store generates warning messages for items in low stock automatically and also sends them to the mobile message box of the store manager. 

•	Loyalty Card: the store can make further special offers to customers who regularly use their branches.

•	Finance Approval: DE-Store offers its customer the opportunity to buy now and pay later using an online finance system, Enabling, which is linked to DE-Store via a portal. 

•	Reports and Analysis: DE-Store tracks the purchase activities of customers from the accounting database and generates reports on how the store is performing.

DE-store is expected to be an expandable and adaptive system to accommodate changing business requirements in the future. 



_______________________________________________________________________________

## MongoDB Required
MongoDB is required in order for the application to work. Follow steps at: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/,
Run CMD as administrator, cd.. MongoDB, net start mongodb.

## Installation of modules
Run `npm install` in order to install required modules.

## Populate database
Run `node populatedb mongodb://localhost` in order to populate the databases.

## Development server
Run `nodemon server.js` for a dev server. Navigate to `http://localhost:3010/`. The app will automatically reload if you change any of the source files.
