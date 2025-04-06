import express from 'express';
import { verifyToken, verifyRole } from '../utils/verifyUser.js'; // Assuming this middleware checks for valid token
import { addProperty, getSellerDashboard,updateProperty,deleteProperty} from '../controllers/seller.controller.js';
import upload from '../utils/multerConfig.js';
console.log(verifyToken); // Should log the `verifyToken` function definition.
console.log(verifyRole); // Should log the `verifyRole` function definition.
console.log(addProperty); // Should log the `addProperty` function definition.
console.log(upload); // Should log the `multer` middleware function.


const router = express.Router();

router.post('/add-property', verifyToken, verifyRole(['seller']),upload.array('images', 6), addProperty);
router.get('/dashboard', verifyToken, verifyRole(['seller']), getSellerDashboard);
router.put('/update/:propertyId', verifyToken, verifyRole(['seller']), upload.array('images', 6), updateProperty);
router.delete('/delete/:propertyId',verifyToken, verifyRole(['seller']),  deleteProperty  );

export default router;
