import User from '../models/user';
import { hashPassword, comparePassword } from '../helpers/auth';
import jwt from 'jsonwebtoken';
import nanoid from 'nanoid';
import expressJwt from 'express-jwt';
import cloudinary from 'cloudinary';

// sendgrid
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// middleware
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export const signup = async (req, res) => {
  console.log('HIT SIGNUP');
  try {
    // validation
    const { name, email, password } = req.body;
    if (!name) {
      return res.json({
        error: 'Name is required',
      });
    }
    if (!email) {
      return res.json({
        error: 'Email is required',
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long',
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: 'Email is taken',
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: 'No user found',
      });
    }
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: 'Wrong password',
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    user.password = undefined;
    user.secret = undefined;
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Error. Try again.');
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // find user by email
  const user = await User.findOne({ email });
  console.log('USER ===> ', user);
  if (!user) {
    return res.json({ error: 'User not found' });
  }
  // generate code
  const resetCode = nanoid(5).toUpperCase();
  // save to db
  user.resetCode = resetCode;
  user.save();
  // prepare email
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: 'Password reset code',
    html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        /* Style for the container */
        .container {
          background-color: #f2f2f2;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          font-family: Arial, sans-serif;
        }
    
        /* Style for the heading */
        h1 {
          color: #333;
          font-size: 28px;
        }
    
        /* Style for the code */
        .reset-code {
          background-color: #0077B6;
          color: #fff;
          font-size: 24px;
          padding: 10px 20px;
          border-radius: 5px;
          display: inline-block;
          margin: 10px 0;
        }
    
        /* Style for the instructions */
        p {
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Password Reset Code</h1>
        <p>Use the following code to reset your password:</p>
        <div class="reset-code">${resetCode}</div>
      </div>
    </body>
    </html>
    `,
  };
  // send email
  try {
    const data = await sgMail.send(emailData);
    // console.log(data);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ ok: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });
    // if user not found
    if (!user) {
      return res.json({ error: 'Email or reset code is invalid' });
    }
    // if password is short
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long',
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = '';
    user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const uploadImage = async (req, res) => {
  // console.log('upload image > user _id', req.user._id);
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: nanoid(),
      resource_type: 'jpg',
    });
    // console.log('CLOUDINARY RESULT => ', result);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
      { new: true }
    );
    // send response
    return res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (password && password.length < 6) {
      return res.json({
        error: 'Password is required and should be min 6 characters long',
      });
    } else {
      // update db
      const hashedPassword = await hashPassword(password);
      const user = await User.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      user.password = undefined;
      user.secret = undefined;
      return res.json(user);
    }
  } catch (error) {}
};
