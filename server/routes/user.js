const express = require('express');
const User = require('../models/user'); 
const Issue = require('../models/issue'); 
const Inventory = require('../models/inventory'); 
const router = express.Router();

router.post('/login', async (req, res) => {
    const { name, rollNumber, department, degree } = req.body;
    try {
        const existingUser = await User.findOne({ where: { rollNumber } });
        if (existingUser) {
            return res.status(200).json(existingUser);
        } else {
            const user = await User.create({ name, rollNumber, department, degree });
            return res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user' });
    }
});

router.get('/:roll', async (req, res) => {
    const { roll } = req.params;
    try {
        const user = await User.findOne({ where: { rollNumber: roll } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let issuedItems = [];
        try{
            issuedItems = await Issue.findAll({ where: { userId: user.id }, include: Inventory });
        } catch (error) { console.error('Error fetching issued items:', error);  }

        return res.status(200).json({ user, issuedItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

module.exports = router;
