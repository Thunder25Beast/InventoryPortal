import express from 'express';
import Controller from '../controllers/Controller.js'
const router = express.Router();


router.get('/items', Controller.getAllItems);

router.get('/items/available', Controller.getAvailableItems);

router.get('/items/:id', Controller.getItem);

router.post('/items', Controller.createItem);

router.delete('/items/:id', Controller.deleteItem);

router.post('/order', Controller.issueItem);

export default router;