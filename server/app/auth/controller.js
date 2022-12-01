const User = require('./model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');


const register = async (req, res, next) => {
    try {

        let payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);

    } catch (err) {
        // Cek kesalahan validasi
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        // Cek error lainnya
        next(err);
    }
}

const localStrategy = async (email, password, done) => {
    try {
        let user = await User.findOne({ email }).select("-__v -createdAt -updatedAt -cart_items -token");

        if (!user) return done();
        if (bcrypt.compareSync(password, user.password)) {
            ({ password, ...userWithoutPassword } = user.toJSON());
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done();
}

const login = async (req, res, next) => {

    passport.authenticate('local', async function (err, user) {
        if (err) return next(err);
        if (!user) return res.json({ error: 1, message: 'Email or Password incorrect' });
        let signed = jwt.sign(user, config.secretKey);
        await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
        res.json({
            message: 'Login Successfully',
            user,
            token: signed
        })
    })(req, res, next)
}

const logout = async (req, res, next) => {
    let token = getToken(req);

    let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });
    if (!token || !user) {
        res.json({
            error: 1,
            message: 'No User Found!!!'
        });
    }
    return res.json({
        error: 0,
        message: 'Logout Berhasil'
    });
}

const me = (req, res, next) => {
    if (!req.user) {
        res.json({
            error: 1,
            message: "You're not login or token expired"
        });
    }

    let user =
    {
        id: req.user._id,
        email: req.user.email,
        phone_number: req.user.phone_number
    };
    res.json(user);
}

const forgotPassword = async (req, res, next) => {

}

module.exports = {
    register,
    localStrategy,
    login,
    logout,
    me,
    forgotPassword
}