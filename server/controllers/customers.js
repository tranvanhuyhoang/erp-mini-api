import mongoose from 'mongoose';
import moment from "moment";

import Customer from '../models/customers';



// create new customer
export async function createCustomer (req, res) {
    const customer = new Customer({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      phone: req.body.phone,
      dayOfBirth: req.body.dayOfBirth,
      listProductsBought: req.body.listProductsBought,
      countOrder: req.body.countOrder,
    });
  
  return customer
    .save()
    .then((newCustomer) => {
      return res.status(201).json({
        success: true,
        message: 'Thêm thành công',
        data: newCustomer,
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

// Get all customer
export function getAllCustomer( req, res){
  Customer.find()
    .select('_id name phone dayOfBirth listProductsBought countOrder')
    .then((data) => {
      return res.status(200).json({
        success: true,
        message: 'Lấy danh sách thành công',
        data,
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

//get single customer
export function getSingleCustomer(req, res) {
  const id = req.params.customerId;
  Customer.findById(id)
    .then((data) => {
      res.status(200).json({
        success: true,
        message: `success`,
        data,
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

export function getBirthdayCustomer(req, res) {
  const month = req.query.month;
  console.log("month ", month)
  let getKey = {
    _id: true,
    name: true,
    phone: true,
    dayOfBirth: true,
    listProductsBought: true,
    countOrder: true,
  }
  
  Customer.find()
  .then((data) => {
    let dataRes = [];

    for(let index in data){
      if(data[index].dayOfBirth && moment(data[index].dayOfBirth).format('M') === month){
        dataRes.push(data[index]);
      }
    }

    if(dataRes.length > 0){
      res.status(200).json({
        status: true,
        message: `success`,
        data: dataRes,
      });  
    }else{
      res.status(200).json({
        status: true,
        message: `Hiện tại chưa có khách hàng có sinh nhật tháng ${month}`,
      });  
    }



    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Hiện chưa có sinh nhật khách hàng nào',
        error: err.message,
      });
   });
}

//update customer
export function updateCustomer(req, res) {
  const id = req.params.customerId;
  const data = req.body;
  Customer.update({ _id:id }, { $set:data })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'cập nhật thành công',
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
}
