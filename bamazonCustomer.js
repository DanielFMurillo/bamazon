//create connection to mysql
var inquirer = require("inquirer");
var mysql = require('mysql');
var tbl = require('console.table');
var con = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root01",
        database: "bamazon"        
});
  con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT item_id, product_name, price FROM products", function (err, res, fields) {      
      console.log('\n');
      console.log(res[1].product_name)
      console.table(res);     
         for (var i = 0; i < res.length; i++) {  
    
    };
        if (err) throw err;
    });
});

var customerQuestions = [{
      type: "input",
      message: "What product ID would you like to purchase?",
      name: "product"
                },
    {
      type: "input",
      message: "How many units would you like to buy?",
      name: "quantity", 
      validate: function (value) {
                        var valid = !isNaN(parseFloat(value));
                        return valid || 'Please enter a number';
    }

  }];

  inquirer.prompt(customerQuestions)  
    .then(function(customerAnswers) {
      var query = "SELECT item_id, product_name, stock_quantity, price FROM products WHERE item_id = ? AND stock_quantity >= ?";
      var param = [customerAnswers.product, parseInt(customerAnswers.quantity)]
      
        con.query(query, param, function(err, res) {
           if (res.length > 0) {
                            var newQuantity = res[0].stock_quantity - parseInt(customerAnswers.quantity);
                            query = "UPDATE products SET stock_quantity = ? WHERE product_name = ?" ;
                            con.query(query, [newQuantity, customerAnswers.product], function(err2, res2){
                                console.log(`${res[0].product_name} was ordered.  There are ${newQuantity} items left.`)
                                 })
                        }
                        else {
                        //If not, no order placed
                            console.log(`There is not enough of Item # ${customerAnswers.product} in inventory for your order.  Please order an amount less than ${customerAnswers.quantity}.`)
                           
                            
                        }
          
      })
    });
