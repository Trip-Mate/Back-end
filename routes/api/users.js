const router = require('express').Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const config = require('../../config/app');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const Trip = require('../../models/Trip');
const Mailgun = require('mailgun-js');
const passwordResetEmail = require('../../templates/passwordResetEmail');

// @route   POST /users
// @desc    Register user
// @access  Public
//TODO: validation including checking for errors should be middleware module
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
   
    email = email.toLowerCase();

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email });

      //TODO: this is not needed, email can be set to unique in model.
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
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
      jwt.sign(
        payload,
        config.secret,
        { expiresIn: 360000 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('server error');
    }
  }
);

// @route   DELETE /users/
// @desc    Delete user
// @access  Private
router.delete('/', auth, async (req, res) => {
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
});

// @route   POST /users/forgot
// @desc    Password Recovery
// @access  Public

router.post('/forgot', async (req, res) => {
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
      const resetLink = `127.0.0.1:3000/reset/${resetPasswordToken}`;

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
      let mailgun = new Mailgun({ apiKey: config.mailgun.apiKey, domain: config.mailgun.testDomain });
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
      // Send the data.
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
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('server error ')
  }
})

// Helper function to create a random token. Separated it for reusability in the future
const createRandomToken = async function () {
  return crypto.randomBytes(20).toString('hex')
}

// Simple function to add hours to the expires token
Date.prototype.addHours = function (h) {
	this.setTime(this.getTime() + h * 60 * 60 * 1000);
	return this;
};


module.exports = router;
