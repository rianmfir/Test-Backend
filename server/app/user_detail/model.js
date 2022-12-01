const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const userDetailSchema = Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    first_name: {
        type: String,
        minLength: [3, 'Panjang first_name minimal 3 karakter'],
        required: [true, 'first_name  harus diisi']
    },

    last_name: {
        type: String,
        minLength: [3, 'Panjang last_name minimal 3 karakter'],
        required: [true, 'last_name harus diisi']
    },

    address: {
        type: String,
        minLength: [5, 'Panjang address minimal 5 karakter'],
        required: [true, 'address harus diisi']
    },

    gender: {
        type: String,
        enum: ['Pria', 'Perempuan'],
        default: 'Pria'
    },

    image_url: String,

}, { timestamps: true });

module.exports = model('User_Detail', userDetailSchema);