const express = require('express');
const Inventory = require('../models/inventory'); 
const Issue = require('../models/issue');  
const User = require('../models/user');  

const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const items = await Inventory.findAll();
        res.json(items);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

router.get('/item/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Inventory.findOne({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const issuedStudents = await Issue.findAll({
            where: { itemId: id },
            include: [{
                model: User,
                as: 'User',  
                attributes: ['id', 'name', 'rollNumber', 'department', 'degree'],
            }]
        });

        res.json({
            item,
            issuedStudents
        });
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to fetch item data' });
    }
});


router.post('/item/:id/issue', async (req, res) => {
    const { id } = req.params;
    const { userId, daysToReturn } = req.body;
    try {
        const item = await Inventory.findOne({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const issue = await Issue.create({
            userId,
            inventoryId: id,
            issueDate: new Date(),
            returnDate,
            returned: false,
        });

        item.quantity -= 1;
        await item.save();

        res.status(200).json(issue);
    } catch (error) {
        console.error('Error issuing item:', error);
        res.status(500).json({ error: 'Failed to issue item' });
    }
});

module.exports = router;
