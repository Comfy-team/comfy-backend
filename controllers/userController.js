const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds);

require("../models/userSchema");
const Cart = mongoose.model('cart')
const User = mongoose.model("users");


module.exports.getAllUsers = (request,response,next) => 
{
    User.find({})
      .then((data) => response.status(200).json(data))
      .catch((error) => next(error));
};

module.exports.getUserById=(request,response,next)=>{
    User.findOne({_id:request.params.id})
    .then((object) =>{
         if(object == null){
            throw new Error("user isn't found");
         }
        response.status(200).json(object)
    })
    .catch((error) => next(error));
}

module.exports.addUser=(request,response,next)=>{
    let object = new User({
        fullName: request.body.fullName,
        password: bcrypt.hashSync(request.body.password, salt),
        email: request.body.email,
        phone: request.body.phone || "",
        address:  request.body.address,
      })

    object.save().then(data=>{
        let cartObj=new Cart({
            user_id:data._id,
            totalPrice:0,
            items:[]
        });
        return cartObj.save();
        
    }).then(async (data)=>{
        await User.updateOne({_id:data.user_id},{$set:{cart_id: data._id}})
        return User.findOne({_id:data.user_id})
    }).then(data=>{
        response.status(201).json(data);
    })
    .catch(error=>next(error))

}

module.exports.updateUser=(request,response,next)=>{
    let password;
    if (request.body.password != undefined){
        password = bcrypt.hashSync(request.body.password, salt);
    }
    //remove the fields that I don't want to update it.
    delete request.body.order; // remove the order field from the request body
    delete request.body.cart_id; // remove the cart_id field from the request body
    User.updateOne(
        {_id:request.body.id},
        {
            $set:{
                ...request.body
            }   
        }).then((data)=>{
            response.status(200).json(data);
        }).catch(error=>next(error));
}

module.exports.deleteUser=(request,response,next)=>{
    User.findOne({ _id: request.body.id })
    .then((user)=>{
        if(!user){
            throw new Error('user not found with the specified _id value');
        }
        return User.deleteOne({ _id: request.body.id });
    }).then((data) => {
        response.status(200).json(data);
    }).catch((error) => next(error));
}

module.exports.getUserCart=(request,response,next)=>{
    User.find({_id:request.params.id},{_id:0,cart_id:1}).populate({path:"cart_id"})
    .then(data=>{
        response.status(200).json(data[0]["cart_id"])
    }).catch(error=>next(error))

}

module.exports.getUserOrders=(request,response,next)=>{
    User.find({_id:request.params.id},{_id:0,order:1}).populate({path:"order"})
    .then(data=>{
        response.status(200).json(data[0]["order"])
    }).catch(error=>next(error))

}

module.exports.getAllUsersOrders=(request,response,next)=>{ 

    User.find({order: { $exists: true, $ne: [] }},{fullName:1}).populate({path:"order"})
    .then(data=>{
        response.status(200).json(data)
    }).catch(error=>next(error))
}

 