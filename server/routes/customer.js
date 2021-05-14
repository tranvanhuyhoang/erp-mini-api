import express from 'express';
import { createCustomer, getAllCustomer, getSingleCustomer, updateCustomer } from '../controllers/customers';
const router = express.Router();
router.get('/', getAllCustomer);
router.get('/:customerId', getSingleCustomer);
// router.delete('/:productId', deleteProduct);
router.post('/', createCustomer);
router.put('/:customerId', updateCustomer);


export default router;