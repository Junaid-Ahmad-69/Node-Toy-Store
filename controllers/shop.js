const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProduct = []
            for(product of products) {
                const cartProductData =cart.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    cartProduct.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProduct,
            });

        })
    })

};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

exports.getProductById = (req, res, next) => {
    const {productId} = req.params;
    Product.findById(productId, product => {
        res.render('shop/product-detail', {
            pageTitle: 'Product Detail',
            product: product,
            path: "/products"
        });
    });
};

exports.getPostProduct = (req, res, next) => {
    const {productId} = req.body;
    Product.findById(productId, product => {
            Cart.addProduct(productId, product.price)
        }
    )
    res.redirect('/cart');
};

exports.postCartDeleteId = (req, res, next)=> {
    const {productId} = req.body;
    Product.findById(productId, product => {
        Cart.deleteProductCart(productId, product.price);
        res.redirect('/cart');
    })
}


exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};
