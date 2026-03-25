// controllers/authController.js
// UPDATED:
// - Now follows the exact same structured response pattern as getDocuments
// - status, statusCode, message, data for EVERY response
// - Consistent success/error format
// - Proper HTTP status codes (201 for signup, 200 for login/google)
// - Added helpful console logs for debugging (matching your getDocuments style)
// - Kept all existing logic + Google verification

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/secrets");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ====================== SIGNUP ======================
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role, phone, university } =
    req.body;

  console.log("signup: Request received", { email, role });

  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role ||
      !phone ||
      !university
    ) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Please enter all fields",
        data: { token: null },
      });
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "User already exists",
        data: { token: null },
      });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      university,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      getJWTSecret(),
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        console.log("signup: User created successfully", { userId: user.id });
        return res.status(201).json({
          status: "success",
          statusCode: 201,
          message: "User registered successfully",
          data: { token },
        });
      },
    );
  } catch (err) {
    console.error("signup: Error", err);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error",
      data: { token: null },
    });
  }
};

// ====================== LOGIN ======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("login: Request received", { email });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid credentials",
        data: { token: null },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Invalid credentials",
        data: { token: null },
      });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      getJWTSecret(),
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        console.log("login: Login successful", { userId: user.id });
        return res.status(200).json({
          status: "success",
          statusCode: 200,
          message: "Login successful",
          data: { token },
        });
      },
    );
  } catch (err) {
    console.error("login: Error", err);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Server error",
      data: { token: null },
    });
  }
};

// ====================== GOOGLE AUTH ======================
// ====================== GOOGLE AUTH (Now supports returning users) ======================
exports.googleAuth = async (req, res) => {
  const { idToken, role, phone, university } = req.body;

  console.log("googleAuth: Request received", {
    hasRole: !!role,
    hasPhone: !!phone,
    hasUniversity: !!university,
  });

  try {
    if (!idToken) {
      return res.status(400).json({
        status: "error",
        statusCode: 400,
        message: "Google ID token is required",
        data: { token: null },
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload["sub"];
    const email = payload["email"];
    const firstName = payload["given_name"] || "";
    const lastName = payload["family_name"] || "";

    let user = await User.findOne({ googleId });

    if (!user) {
      // NEW USER
      if (!role || !phone || !university) {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Role, phone and university are required for new users",
          data: { token: null },
        });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          status: "error",
          statusCode: 400,
          message: "Email already registered with password",
          data: { token: null },
        });
      }

      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        role,
        phone,
        university,
        password: "",
        verified: false,
      });
      await user.save();
      console.log("googleAuth: New Google user created successfully", {
        userId: user.id,
      });
    } else {
      console.log("googleAuth: Returning Google user found", {
        userId: user.id,
      });
    }

    const jwtPayload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      jwtPayload,
      getJWTSecret(),
      { expiresIn: process.env.JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;

        return res.status(200).json({
          status: "success",
          statusCode: 200,
          message: "Google authentication successful",
          data: {
            token,
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              university: user.university,
            },
          },
        });
      },
    );
  } catch (err) {
    console.error("googleAuth: Error", err);
    return res.status(500).json({
      status: "error",
      statusCode: 500,
      message: "Invalid Google token or server error",
      data: { token: null },
    });
  }
};

// ====================== SEND OTP (Phone Login - Uber Primary) ======================
// exports.sendOtp = async (req, res) => {
//   const { phone } = req.body;
//   console.log("sendOtp: Request received", { phone });

//   try {
//     if (!phone) {
//       return res.status(400).json({
//         status: "error",
//         statusCode: 400,
//         message: "Phone number is required",
//         data: { otpSent: false },
//       });
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP in memory (10-minute expiry) - use Redis in production
//     otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 });

//     // ================== REAL Twilio SMS (Direct SMS - as you requested) ==================
//     const twilio = require("twilio")(
//       process.env.TWILIO_ACCOUNT_SID,
//       process.env.TWILIO_AUTH_TOKEN,
//     );

//     await twilio.messages.create({
//       body: `Your Uber-like app OTP is ${otp}. Valid for 10 minutes. Do not share it.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phone,
//     });

//     console.log(`✅ SMS sent via Twilio to ${phone} | OTP: ${otp}`);

//     return res.status(200).json({
//       status: "success",
//       statusCode: 200,
//       message: "OTP sent successfully via SMS",
//       data: { phone, otpSent: true },
//     });
//   } catch (err) {
//     console.error("sendOtp: Twilio SMS Error", err);
//     return res.status(500).json({
//       status: "error",
//       statusCode: 500,
//       message: "Failed to send OTP",
//       data: { otpSent: false },
//     });
//   }
// };
