const ProductModel = require('@models/Product');
// const { options } = require('../routes');

function createProduct(newProduct){
    return ProductModel.create(newProduct);
}

function getProduct(page=1, pageSize=10, sort = ""){
    let skip = (page - 1) * pageSize;
    return ProductModel.find({}).skip(skip).limit(pageSize).sort(sort);
}

function getTotalProduct(){
    return ProductModel.countDocuments({})
}

function getProductId(id){
    return ProductModel.findOne({
        _id: id
    })
}

function updateProduct(id, objUpdate){
    return ProductModel.updateOne({
        _id: id
    }, objUpdate)
}

function deleteProduct(id){
    return ProductModel.deleteOne({
        _id: id
    })
}

async function updateQuantityListProduct(listProduct){
    const ids = listProduct.map(item => item.product);
    const products = await ProductModel.find({_id: {$in: ids}});

    // Kiểm tra số lượng sau khi giảm
    for(const item of listProduct){
        const product = products.find(p => p._id.equals(item.product));
        if(!product){
            throw new Error(`Product with id ${item.product} not found`);
        }
        if(product.stock - item.quantity < 0){
            throw new Error(`Product with id ${item.product} will have negative quantity`);
        }
    }

    const bulkOps = listProduct.map(item => ({
        updateOne: {
            filter: {_id: item.product},
            update: {$inc: {stock: -item.quantity}},
            options: {runValidators: true},
            skipValidation: false,
        }
    }));

    return ProductModel.bulkWrite(bulkOps);
}

module.exports = {
    createProduct,
    getProduct,
    getTotalProduct,
    getProductId,
    updateProduct,
    deleteProduct,
    updateQuantityListProduct
}