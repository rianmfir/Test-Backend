const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const productSchema = Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    name_product: {
        type: String,
        minLength: [3, 'Panjang nama produk minimal 3 karakter'],
        required: [true, 'Nama produk harus diisi']
    },

    price: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        maxLength: [1000, 'Panjang deskripsi maksimal 1000 karakter'],
    },

    image_url: String,

}, { timestamps: true });

module.exports = model('Product', productSchema);