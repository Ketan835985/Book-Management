const userModel = require('../models/userModel');
const validator = require('validator');
const { titleCheck, passwordCheck } = require('../utils/validations');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const userRegister = async (req, res) => {
    try {
        const { title, name, phone, email, password } = req.body;
        if (!title || !name || !phone || !email || !password || name.trim() == '' || email.trim() == '') {
            return res.status(400).json({ status: false, message: 'Please fill all the fields' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ status: false, message: 'Please enter a valid email address' });
        }
        if (!titleCheck(title)) {
            return res.status(400).json({ status: false, message: 'Please enter a valid title' });
        }
        if (!passwordCheck(password)) {
            return res.status(400).json({ status: false, message: 'Please enter a valid password which length is 8 to 15' });
        }
        if (!validator.isMobilePhone(phone)) {
            return res.status(400).json({ status: false, message: 'Please enter a valid phone number' });
        }
        const userPhone = await userModel.findOne({ phone: phone });
        if (userPhone) {
            return res.status(400).json({ status: false, message: 'Phone number already exists' });
        }
        else {
            const user = await userModel.findOne({ email: email });
            if (user) {
                return res.status(400).json({ status: false, message: 'Email already exists' });
            }
            else {
                const newUser = await userModel.create(req.body)
                res.status(201).json({ status: true, message: 'User registered successfully', data: newUser });
            }
        }

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Please fill all the fields' });
        }
        const user = await userModel.findOne({ email: email, password: password });
        if (!user) {
            return res.status(401).json({ status: false, message: 'User not found' });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY);
        res.setHeader('x-api-key', token);
        return res.status(200).json({ status: true, data: { token: token } });
        
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = {
    userRegister,
    userLogin,
}
