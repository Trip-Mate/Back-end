const router = require('express').Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('../../config/app');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const Trip = require('../../models/Trip');

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
    const { email } = req.body.user;
    const user = await User.findOne({ email }).select('-password');

    if (user) {
      console.log(user)
    } 
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error ')
  }
})

module.exports = router;
