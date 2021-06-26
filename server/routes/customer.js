import express from 'express';
import { 
  createCustomer, 
  getAllCustomer, 
  getSingleCustomer, 
  updateCustomer, 
  getBirthdayCustomer
} from '../controllers/customers';
const router = express.Router();
router.get('/', getAllCustomer);
router.get('/get-birth-day-customer', getBirthdayCustomer);
router.get('/:customerId', getSingleCustomer);
// router.delete('/:productId', deleteProduct);
router.post('/', createCustomer);
router.put('/:customerId', updateCustomer);


export default router;