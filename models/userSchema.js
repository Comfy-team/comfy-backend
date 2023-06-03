const mongoose=require("mongoose");

const addressSchema = new mongoose.Schema({
    city: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    building: {
      type: Number,
      required: true,
      min: 1
    },
    governorate: {
      type: String,
      required: true
    },
    apartment: {
      type: String,
      required: true
    },
    postalCode: {
      type: Number,
      required: true,
      min: 1
    }
  },{ _id: false });

const schema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
    },
    cart_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'carts',
        required:true
    },
    order:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'orders'
    },
    address:{
        type: addressSchema,
    }
})

mongoose.model("users",schema);