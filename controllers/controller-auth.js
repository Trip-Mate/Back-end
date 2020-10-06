const User = require('../models/User');

const jwt = require('jsonwebtoken');
const config = require('../config/app');

const {
    validationResult
} = require('express-validator');

const bcrypt = require('bcryptjs');

// @route   GET /auth
// @desc    Auth route
// @access  Public
exports.authRoute = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// @route   POST /auth
// @desc    Authenticate user and get token
// @access  Public
exports.authUser = async (req, res) => {

    const {
        email,
        password
    } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        let user = await User.findOne({
            email
        });

        if (!user) {
            return res
                .status(400)
                .json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({
                    errors: [{
                        msg: 'Invalid credentials'
                    }]
                });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        // TODO: Change expiresIn time to something more reasonable
        jwt.sign(
            payload,
            config.secret, {
                expiresIn: config.token_exp
            },
            (error, token) => {
                if (error) throw error;
                res.json({
                    token,
                    user
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server error');
    }
};