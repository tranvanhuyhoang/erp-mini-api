import express from 'express';
import { createFinance, getAllFinance, updateFinance} from '../controllers/finance';
const router = express.Router();
router.get('/', getAllFinance);
// router.get('/:productId', getSingleProduct);
// router.delete('/:productId', deleteProduct);
router.post('/', createFinance);
router.put('/:financeId', updateFinance);


export default router;