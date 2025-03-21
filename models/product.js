const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) return cb([]);
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProduct = products.findIndex((product) => product.id === this.id);
                const updatedProduct = [...products];
                console.log("updatedProduct", updatedProduct);
                updatedProduct[existingProduct] = this
                fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }

        });
    }

    static deleteProduct(id) {
        getProductsFromFile(products => {
            const product = products.find((prod) => prod.id === id);
            const updateProduct = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updateProduct), err => {
                if(!err){
                    Cart.deleteProductCart(id, product.price )
                }
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product)
        });
    }
};
