const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

let userSchema = Schema({

    email: {
        type: String,
        maxlength: [255, 'Panjang email maksimal 255 karakater'],
        required: [true, 'Email harus diisi']
    },

    password: {
        type: String,
        maxlength: [255, 'Panjang password maksimal 255 karakater'],
        required: [true, 'Password harus diisi']
    },

    phone_number: {
        type: Number,
        default: 0
    },

    token: [String]

}, { timestamps: true });

// Validasi email
userSchema.path('email').validate(function (value) {
    const EMAIL_RE = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

// Cek email terdaftar
userSchema.path('email').validate(async function (value) {
    try {
        const count = await this.model('User').count({ email: value });
        return !count;
    } catch (err) {
        throw err;
    }
}, attr => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = model('User', userSchema);