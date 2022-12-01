const User_Detail = require('./model');
const User = require('../auth/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');
const path = require('path');
const fs = require('fs');


const store = async (req, res, next) => {
    try {
        let payload = req.body;

        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let user_detail = new User_Detail({ ...payload, user_id: req.user?._id })
                    if (req.user) {
                        await user_detail.save();
                        return res.json(user_detail);
                    }
                    return res.json({
                        error: 1,
                        message: "You are not allowed to create User_Details"
                    });

                } catch (err) {
                    fs.unlinkSync(target_path);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        })
                    }

                    next(err);
                }
            });
            src.on('error', async () => {
                next(err);
            });
        } else {
            let user_detail = new User_Detail({ ...payload, user_id: req.user?._id });
            if (req.user) {
                await user_detail.save();
                return res.json(user_detail);
            }
            return res.json({
                error: 1,
                message: "You are not allowed to create User_Details"
            });


        }
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

const index = async (req, res, next) => {
    try {
        // let user = req.user;
        let user_detail = await User_Detail
            .findOne({ user_id: req.user.id })
            .populate('user_id')

        return res.json({
            // data: user_detail,
            data: user_detail,

        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store, index
}