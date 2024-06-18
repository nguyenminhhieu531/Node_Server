const mongoose = require('@config/mongodb')
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listProduct: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    status: {
        type: String,
        enum: ['new', 'done', 'cancel'],
        default: 'new'
    }
}, { 
    collection: 'order',
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
