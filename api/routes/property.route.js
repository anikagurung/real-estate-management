import express from 'express';
import { getAllProperties, getPropertyById } from '../controllers/property.controller.js';

const router = express.Router();

// Route to fetch all properties
router.get('/', getAllProperties);

// Route to fetch property by ID
router.get('/:id', getPropertyById);

export default router;
