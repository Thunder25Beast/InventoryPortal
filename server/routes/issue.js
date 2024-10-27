const express = require('express');
const Item = require('../models/inventory');  
const Issue = require('../models/issue');  
const User = require('../models/user'); 

const router = express.Router();

router.get('/item/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findOne({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const issuedStudents = await Issue.findAll({
            where: { inventoryId: id },
            include: [{
                model: User,
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
        const item = await Item.findOne({ where: { id } });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const issue = await Issue.create({
            userId,
            inventoryId: id,
            issueDate: new Date(),
            daysToReturn,
            returned: false,
        });

        res.status(200).json(issue);
    } catch (error) {
        console.error('Error issuing item:', error);
        res.status(500).json({ error: 'Failed to issue item' });
    }
});

module.exports = router;
