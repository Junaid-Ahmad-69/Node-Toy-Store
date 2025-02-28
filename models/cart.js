const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            let cart = {products: [], totalPrice: 0}
            if (!err) {
                cart = JSON.parse(data)
            }
            const existingCartProductIndex = cart.products.findIndex(p => p.id === id); // id
            const existingProduct = cart.products[existingCartProductIndex] // {get the object from cart using their index using id}
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct}; // get only id and qty in variable so if changing occur it will update
                updatedProduct.qty += 1
                cart.products[existingCartProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + Number(productPrice);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err)
            })
        })
    }

    static deleteProductCart(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (err) return console.log(err);
            const updateCart = {...JSON.parse(data)}
            const product = updateCart.products.find(p => p.id === id);
            if(!product) return;
            const productQty = product.qty;
            updateCart.products = updateCart.products.filter(p => p.id !== id);
            updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updateCart), (err) => {
                if (!err) return console.log(err);
            });

        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, data) => {
            const cart = JSON.parse(data);
            if (err) {
                cb(null);
            } else {
                cb(cart)
            }
        })

    }
}