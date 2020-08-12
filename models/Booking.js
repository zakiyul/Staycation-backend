const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndSchema: {
    type: Date,
    required: true,
  },
  invoice: {
    type: Number,
    required: true,
  },
  itemId: {
    _id: {
      type: ObjectId,
      ref: "Item",
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  memberId: {
    type: ObjectId,
    ref: "Member",
  },
  bankId: {
    type: ObjectId,
    ref: "Bank",
  },
  payment: {
    proofPayment: {
      type: String,
      required: true,
    },
    bankForm: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
