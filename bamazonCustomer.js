var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");
// require("console.table");

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
        // console.log("Purchase value: ", val)
        // console.log("WHAT TYPE IS THIS????...", typeof val.id);
        // console.log("Inventory: ", inventory)
        // console.log("WHAT IS THISSSSSSSS?!?!....", val.id);
        var item = getID(val.id, inventory);
        // console.log("Purchase function: ", item)

        if (item) {
            chooseAmount(item);
        } else {
            console.log("-------------------------------------------------");
            console.log("Product is not available. Please choose a valid ID.");
            console.log("-------------------------------------------------");
            showInventory();
        }

    })
}

//only getting a correct response when I input the number of rows in the database, currently only responds to '8'

function getID(val, inventory) {
    var data;
    // console.log("ID function: " + val)
    // console.log(typeof val)
    // console.log(inventory)
    for (var i = 0; i < inventory.length; i++) {
        // console.log(inventory[i].item_id)
        // console.log("HAYYYYY.... ", inventory[i].item_id);
        if (inventory[i].item_id === val) {
            // console.log("Match: ", inventory[i].item_id)
            data = inventory[i];
            return data;
            // console.log("Data: ", data); 
        } else {
            // console.log("None")
            data = null;
        }
    }
    return data;
};

function chooseAmount(item) {
    console.log("Item:", item.item_id)
    console.log("Stock Quantity: " + item.stock_quantity)
    inquirer.prompt([{
        name: "amount",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function (val) {
            return !isNaN(val) || val.toLowerCase() === "q";
        },
        filter: Number
    }]).then(function (val) {
        console.log("Value: ", val.amount);
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

          console.log("Thank you for your purchase! Your total is $" + val.amount * item.price);
          closeCart();
        } else {
            console.log("-------------------------------------------------");
            console.log("Insufficient quantity! Please choose a different quantity or item.");
            console.log("-------------------------------------------------");
            showInventory();
        }
    });
};

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