const connection = require("./dbConnection.js");
const emailValidator = require("deep-email-validator");
const bcrypt = require("bcrypt");
const passwordValidator = require("validator");
const transporter = require("./mail-config");

let otpExpiration;
// In-memory store for OTPs (You may use a database for production)
const otpStore = {};

async function checkNameExists(name) {
  const [rows] = await connection.execute("SELECT * FROM user WHERE name = ?", [
    name,
  ]);
  return rows.length > 0;
}

async function checkEmailExists(email) {
  const [rows] = await connection.execute(
    "SELECT * FROM user WHERE email = ?",
    [email]
  );
  return rows.length > 0;
}

async function insertUser(name, email, password) {
  await connection.execute(
    "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
}

exports.signUp = async (req, res) => {
  try {
    const emailValidationResult = await emailValidator.validate(req.body.email);

    if (emailValidationResult.valid) {
      const nameCheckResult = await checkNameExists(req.body.name);
      const emailCheckResult = await checkEmailExists(req.body.email);

      if (!nameCheckResult && !emailCheckResult) {
        let passwordValidationResult = passwordValidator.isStrongPassword(
          req.body.password
        );
        if (passwordValidationResult) {
          //Hashing the password
          let salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(req.body.password, salt);

          await insertUser(req.body.name, req.body.email, hashedPassword);
          //Initialzing session values
          req.session.user = req.body.name;
          req.session.authorized = true;

          res.json({
            success: true,
            message: "Signup successful",
            username: req.session.user,
          });
        } else {
          res.json({ success: false, message: "Password not strong enough" });
        }
      } else {
        res.status(401).json({
          success: false,
          message: nameCheckResult
            ? "Username already exists"
            : "User with this email already exists",
        });
      }
    } else {
      res.status(401).json({ success: false, message: "Email is not valid" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const [rows] = await connection.execute("SELECT * FROM user WHERE name = ?", [
    req.body.name,
  ]);
  if (rows.length > 0) {
    let passwordValidationResult = await bcrypt.compare(
      req.body.password,
      rows[0].password
    );
    if (passwordValidationResult) {
      //Initialzing session values
      req.session.user = req.body.name;
      req.session.authorized = true;

      res.json({
        success: true,
        message: "Login successful",
        username: req.session.user,
      });
    } else {
      res.json({ success: false, message: "Password is wrong" });
    }
  }
};

exports.logout = async (req, res) => {
  req.session.user = "";
  req.session.authorized = false;
  res.json({ success: true, message: "Logged out successfully" });
};

exports.sendOtp = async (req, res) => {
  const [rows] = await connection.execute("select * from user where email=?", [
    req.body.email,
  ]);
  if (rows[0] != undefined) {
    const email = req.body.email; // Replace with the recipient's email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const timestamp = Date.now();
    otpExpiration = 10 * 60 * 1000; // Set OTP expiration time (10 minutes in milliseconds)

    // Send OTP via email
    const mailOptions = {
      from: "kh.s.k.rohan@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
      headers: {
        "Content-Type": "text/plain",
      },
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending OTP:", error);
        res.json({ success: false, message: "Failed to send OTP" });
      } else {
        // Store the OTP with its timestamp
        otpStore[email] = { otp, timestamp };
        res.json({ success: true, message: "OTP sent successfully" });
      }
    });
  } else {
    res.json({ success: false, message: "Email does not exist in user base" });
  }
};

exports.verifyOtp = async (req, res) => {
  const storedOTP = otpStore[req.body.email];
  console.log(otpStore[req.body.email], storedOTP, otpExpiration);
  if (storedOTP && Date.now() - storedOTP.timestamp <= otpExpiration) {
    if (req.body.enteredOTP === storedOTP.otp) {
      // OTP is valid
      delete otpStore[req.body.email]; // Remove the OTP from the store after successful verification
      res.json({ success: true, message: "OTP is valid" });
    } else {
      // Invalid OTP
      res.json({ success: false, message: "Invalid OTP" });
    }
  } else {
    // OTP has expired or does not exist
    res
      .status(400)
      .json({ success: false, message: "OTP has expired or does not exist" });
  }
};

exports.setNewPassword = async (req, res) => {
  if (req.body.newPassword == req.body.confirmedPassword) {
    let passwordValidationResult = passwordValidator.isStrongPassword(
      req.body.newPassword
    );
    if (passwordValidationResult) {
      let salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      try {
        await connection.execute("update user set password=? where email=?", [
          hashedPassword,
          req.body.email,
        ]);
        res.json({ success: true, message: "Password successfully changed" });
      } catch {
        console.error(error);
        res.json({
          success: false,
          message: "Unexpected error.Set password again",
        });
      }
    } else {
      res.json({ success: false, message: "Password is weak" });
    }
  } else {
    res.json({ success: false, message: "Passwords do not match" });
  }
};
