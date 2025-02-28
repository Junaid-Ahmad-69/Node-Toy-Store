const Product = require('../models/product');
const req = require("express/lib/request");
const res = require("express/lib/response");

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editMode: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, imageUrl, price, description);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const {productId} = req.params;
    Product.findById(productId, (product) => {
        if (!product) return res.redirect('/')
        res.render('admin/edit-product', {
            products: product,
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editMode: editMode,
        });
    })
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updateTitle = req.body.title;
    const updateImage = req.body.imageUrl;
    const updatePrice = req.body.price;
    const updateDescription = req.body.description;
    const updateProduct = new Product(id, updateTitle, updateImage, updatePrice, updateDescription);
    updateProduct.save();
    res.redirect('/');
}

exports.postDeleteProduct = (req, res, next) => {
    const {productId} = req.body;
    Product.deleteProduct(productId)
    res.redirect('/admin/products');
}


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};