import mongoose from 'mongoose';
import Finance from '../models/finance';


// create new cause
export async function createFinance (req, res) {
    const finance = new Finance({
      _id: mongoose.Types.ObjectId(),
      date: req.body.date,
      mountSale: req.body.mountSale,
      totalMoney: req.body.totalMoney,
      inventory: req.body.inventory,
    });
  
  return finance
    .save()
    .then((newFinance) => {
      return res.status(201).json({
        success: true,
        message: 'Thêm thành công',
        data: newFinance,
      });
    })
    .catch((error) => {
        console.log(error);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
      });
    });
}

// Get all course
export function getAllFinance( req, res){
  Finance.find()
    .select('_id date mountSale totalMoney inventory')
    .then((allFinance) => {
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách thành công',
        data: allFinance,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
}

// // get single product
// export function getSingleProduct(req, res) {
//   const id = req.params.productId;
//   Product.findById(id)
//     .then((singleProduct) => {
//       res.status(200).json({
//         success: true,
//         message: `More on ${singleProduct.title}`,
//         data: singleProduct,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         success: false,
//         message: 'This course does not exist',
//         error: err.message,
//       });
//    });
// }

// // // update finance
export function updateFinance(req, res) {
  const id = req.params.financeId;
  const updateObject = req.body;
  Finance.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'cập nhật thành công',
        data: updateObject,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
}
