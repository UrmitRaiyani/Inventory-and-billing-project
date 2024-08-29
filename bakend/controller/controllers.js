
const adminData = require('../models/userRegistration');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports.register = async (req,res) => {
try {
    const { email, password } = req.body;
    let existingUser = await adminData.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    else if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    else {
        const newUser = new adminData({
            email: req.body.email,
            password: req.body.password
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        return res.status(200).json({ message: 'User registered successfully'});
    } 
} catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' });
}}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await adminData.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'secret-key', { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports.getallData = async (req,res) => {
    try {
        const user = await adminData.find();
        return res.status(200).json({message:'Data Fetch successfully',user});
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
}

