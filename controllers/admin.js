const Order = require("../models/order")



exports.getOrders = async (req , res, next) => {
   const orders = await Order.find().sort({createdAt: 'desc'})
   res.status(200).json(orders)
}