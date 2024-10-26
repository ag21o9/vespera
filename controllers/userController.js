const User = require("../models/User");
const Stock = require("../models/Stock");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User signup
exports.signup = async (req, res) => {
  try {
    const { name, email, aadhar, pan, username, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, email, aadhar, pan, username, phone, password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buy stocks
exports.buyStock = async (req, res) => {
  const { userId } = req.user;
  const { stockId, numShares } = req.body;
  try {
    const stock = await Stock.findById(stockId);
    if (!stock || stock.availableShares < numShares) {
      return res.status(400).json({ message: "Not enough shares available" });
    }
    stock.availableShares -= numShares;
    await stock.save();
    res.json({ message: "Stock purchased successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sell stocks
exports.sellStock = async (req, res) => {
  const { userId } = req.user;
  const { description, pricePerShare, numShares } = req.body;
  try {
    const newStock = new Stock({
      description,
      pricePerShare,
      availableShares: numShares,
      seller: userId,
    });
    await newStock.save();
    res.json({ message: "Stock listed for sale" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marketplace - get all listed stocks
exports.marketplace = async (req, res) => {
  try {
    const stocks = await Stock.find().populate("seller", "username");
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
