import Item from '../models/item.js';
import Students from '../models/student.js';
import Orders from '../models/order.js';
import {connection} from '../config/db.js';

//get all items
const getAllItems = async (req,res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

//get available items
const getAvailableItems = async (req,res) => {
    try {
        const items = await Item.findAll({
            where: {
                quantityAvilable: {
                    [Op.gt]: 0
                }
            }
        });
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

//get single item
const getItem = async (req,res) => {
    try {
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({msg:'Item not found'});
        }
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

//create item
const createItem = async (req,res) => {
    try {
        const item = await Item.create(req.body);
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Controller function to delete a item by ID
const deleteItem = async (req, res) => {
    const itemId = req.params.id;
  
    try {
      // Attempt to delete the item
      const result = await Item.destroy({
        where: {
          id: itemId
        }
      });
  
      // Check if any rows were deleted
      if (result === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Return a success response
      return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while deleting the Item' });
    }
  };

//issue item to student
const issueItem = async (req,res) => {
    const { itemId, studentId, quantity, duedate } = req.body;

    try {
        const item = await Item.findById(itemId);

        if(!item){
            return res.status(404).json({msg:'Item not found'});
        }

        if(item.quantityAvilable < quantity){
            return res.status(400).json({msg:'Not enough items available'});
        }
        item.quantityAvilable -= quantity;
        await item.save();


        const student = await Students.findById(studentId);

        if(!student){
            return res.status(404).json({msg:'Student not found'});
        }

        const order = await Orders.create({
            itemname: item.name,
            itemDesc: item.description,
            nameOfStudent: student.name,
            studentroll: student.rollNumber,
            year: student.year,
            issuedAt: new Date(),
            dueDate: duedate
        });

        return res.json(order);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const Controller = {
    getAllItems,
    getAvailableItems,
    getItem,
    createItem,
    deleteItem,
    issueItem
}

export default Controller;