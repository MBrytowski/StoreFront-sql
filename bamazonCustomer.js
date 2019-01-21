var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
    host: "localhost",

    //Port
    port: 8889,

    //Username
    user: "root",

    //Password
    password: "root",
    database: "bamazon"
});

//Initiate connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("------------------------------------------------");
    console.log("Welcome! Take a look at the available Inventory.");
    console.log("------------------------------------------------");
    showInventory();
});

//Show Inventory
function showInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var t = new Table;

        res.forEach(function(products) {
            t.cell("Product Id", products.item_id)
            t.cell("Product Name", products.product_name)
            t.cell("Price, USD", products.price, Table.number(2))
            t.newRow()
        })
        console.log(t.toString());
        
        promptPurchase(res);
    })
};

//Prompts user for purchase
function promptPurchase(inventory) {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the item would you like to purchase?",
        validate: function (val) {
            return !isNaN(val) || val.toLowerCase() === "q";
        },
        filter: Number

    }]).then(function (val) {
        var item = getID(val.id, inventory);

        if (item) {
            chooseAmount(item);
        } else {
            console.log("-------------------------------------------------");
            console.log("Product is not available. Please choose a valid ID.");
            console.log("-------------------------------------------------");
            showInventory();
        }

    })
};

//Validates the user chosen item ID
function getID(val, inventory) {
    var data;
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === val) {
            data = inventory[i];
            return data; 
        } else {
            data = null;
        }
    }
    return data;
};

//Prompts user to choose the amount of the selected item
function chooseAmount(item) {
    inquirer.prompt([{
        name: "amount",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function (val) {
            return !isNaN(val) || val.toLowerCase() === "q";
        },
        filter: Number
    }]).then(function (val) {
        if (item.stock_quantity > val.amount) {
        connection.query("UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: item.stock_quantity - val.amount
        },{
            item_id: item.item_id
        }],
        function(error) {
            if (error) throw err;
          });
          console.log("------------------------------------------------");
          console.log("Thank you for your purchase! Your total is $" + val.amount * item.price);
          console.log("------------------------------------------------");
          closeCart();
        } else {
            console.log("-------------------------------------------------");
            console.log("Insufficient quantity! Please choose a different quantity or item.");
            console.log("-------------------------------------------------");
            showInventory();
        }
    });
};

//Gives user choice to select more items or to quit the program
function closeCart() {
    inquirer.prompt([{
        name: "end",
        type: "list",
        message: "Please choose your next action.",
        choices: ["Choose another item.", "Quit"]
    }]).then(function(answer){
        if(answer.end === "Quit"){
            connection.end();
        } else {
            showInventory();
        }
    })
};