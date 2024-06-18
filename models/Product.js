const mongoose = require('@config/mongodb')
const { Schema } = mongoose;

// Define the schema
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    },
    gallery: [
        {
            type: String
        }
    ]
}, {
    collection: 'product',
    timestamps: true // This adds createdAt and updatedAt fields
});

// Create the model
const Product = mongoose.model('Product', productSchema);

// Export the model
module.exports = Product;
