
const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Mailgun = require('mailgun-js');
const config = require('../config/app');
const User = require('../models/User');
const Trip = require('../models/Trip');
const passwordResetEmail = require('../templates/passwordResetEmail');
const passwordResetSuccess = require('../templates/passwordResetSuccess');


// @route   POST /users
// @desc    Register user
// @access  Public
exports.registerUser = async (req, res) => {
	let { name, email, password } = req.body;
	const errors = validationResult(req);

	email = email.toLowerCase();

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		let user = await User.findOne({ email });

		//TODO: this is not needed, email can be set to unique in model.
		if (user) {
			return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
		}
		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm',
		});

		user = new User({
			name,
			email,
			password,
			avatar,
		});

		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		// TODO: Change expiresIn time to something more reasonable
		jwt.sign(payload, config.secret, { expiresIn: 360000 }, (error, token) => {
			if (error) throw error;
			return res.json({ token, user });
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send('server error');
	}
};

// @route   DELETE /users/
// @desc    Delete user
// @access  Private
exports.deleteUser = async (req, res) => {
	try {
		await User.deleteOne({ _id: req.user.id });

		await Trip.updateMany(
			{ user: { $in: req.user.id } },
			{ $pull: { user: { $in: req.user.id } } }
		);
		// 200 OK
		return res.status(200).send('User has been deleted');
	} catch (error) {
		// Checks if the :id passed in is not a valid ObjectId
		if (error.kind == 'ObjectId') {
			return res.status(400).json({ msg: "User doesn't exsist" });
		}
		console.error(error.message);
		res.status(500).send('server error');
	}
};

// @route   POST /users/forgot
// @desc    Password Recovery
// @access  Public
exports.forgotPassword = async (req, res) => {
	try {
		// Get the email sent from the front-end
		let { email } = req.body.user;
		email = email.toLowerCase();

		// Look for the user with the corresponding email
		const user = await User.findOne({ email }).select('-password');

		// If user exists
		if (user) {
			// Generate password reset token and add expiry date
			const resetPasswordToken = await createRandomToken();
			const resetPasswordExpires = new Date().addHours(1);

			// Creating a reset link to send in the email
			const resetLink = `http://localhost:3000/reset/${resetPasswordToken}`;

			const userWithToken = await User.findOneAndUpdate(
				{ email },
				{
					resetPasswordToken,
					resetPasswordExpires,
				}
			);
			// Checking if everything has been saved correctly
			if (!userWithToken) {
				return res
					.status(500)
					.send(
						'Something went wrong, if this issue persist please contact support'
					);
			}

			// Mailgun sending functions
			let mailgun = new Mailgun({
				apiKey: config.mailgun.apiKey,
				domain: config.mailgun.testDomain,
			});
			// Prepare the data expected by mailgun
			let data = {
				//Specify email data
				from: config.mailgun.fromEmail,
				//The email to contact
				to: email,
				//Subject and text data
				subject: 'Trip Mate - Password Reset',
				html: passwordResetEmail.body(user, resetLink),
			};
			// Send the data
			mailgun.messages().send(data, function (error) {
				if (error) {
					console.log(error);
					return res.status(500).send('server error');
				} else {
					return res.status(200).json({
						msg: 'If your mail is registered we have sent you an email',
					});
				}
			});
		}
		// return res.status(200).send('Success')
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('server error ');
	}
};

// @route   POST /users/reset
// @desc    Password Reset
// @access  Public
exports.resetPassword = async (req, res) => {
	let { resetPasswordToken, password } = req.body;

	try {
		let updatedUser = await User.findOne({ resetPasswordToken });

		if (updatedUser) {
			if (updatedUser.resetPasswordExpires > Date.now()) {
				const salt = await bcrypt.genSalt(10);

				updatedUser.password = await bcrypt.hash(password, salt);
				await updatedUser.save();

				const payload = {
					user: {
						id: updatedUser.id,
					},
				};

				// TODO: Change expiresIn time to something more reasonable
				jwt.sign(
					payload,
					config.secret,
					{ expiresIn: 360000 },
					(error, token) => {
						if (error) throw error;
						return res.json({ token });
					}
				);

				// Mailgun sending functions
				let mailgun = new Mailgun({
					apiKey: config.mailgun.apiKey,
					domain: config.mailgun.testDomain,
				});
				// Prepare the data expected by mailgun
				let data = {
					//Specify email data
					from: config.mailgun.fromEmail,
					//The email to contact
					to: updatedUser.email,
					//Subject and text data
					subject: 'Trip Mate - Password Reset Success',
					html: passwordResetSuccess.body(updatedUser.name),
				};
				// Send the data
				mailgun.messages().send(data, function (error) {
					if (error) {
						console.log(error);
						return res.status(500).send('server error');
					} else {
						return null;
					}
				});
			} else {
				res.send('token expired');
			}
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send('server error ');
	}
};

// Helper function to create a random token. Separated it for reusability in the future
const createRandomToken = async function () {
	return crypto.randomBytes(20).toString('hex');
};

// Simple function to add hours to the expires token
Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + h * 60 * 60 * 1000);
	return this;
};