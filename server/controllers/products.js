import mongoose from 'mongoose';
import Product from '../models/products';


// create new cause
export async function createProduct (req, res) {
    const product = new Product({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      type: req.body.type,
      total: req.body.total,
      totalSold: req.body.totalSold,
      avatar: req.files['avatar'][0].path,
    });
  
  return product
    .save()
    .then((newProduct) => {
      return res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm thành công',
        data: newProduct,
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
export function getAllProducts( req, res){
  Product.find()
    .select('_id name type total totalSold avatar')
    .then((allProducts) => {
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách thành công',
        data: allProducts,
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
export function getSingleProduct(req, res) {
  const id = req.params.productId;
  Product.findById(id)
    .then((singleProduct) => {
      res.status(200).json({
        success: true,
        message: `More on ${singleProduct.title}`,
        data: singleProduct,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'This course does not exist',
        error: err.message,
      });
   });
}

// // update course
export function updateProduct(req, res) {
  const id = req.params.productId;
  const updateObject = req.body;
  Product.update({ _id:id }, { $set:updateObject })
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

// // delete a course
export function deleteProduct(req, res) {
  const id = req.params.productId;
  Product.findByIdAndRemove(id)
    .exec()
    .then(()=> res.status(204).json({
      success: true,
      message: 'Xóa sản phẩm thành công',
    }))
    .catch((err) => res.status(500).json({
      success: false,
    }));
}
