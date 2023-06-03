const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10
const salt = bcrypt.genSaltSync(saltRounds);

require("../models/userSchema");

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
        phone: request.body.phone,
        cart_id: request.body.cart_id,
        order: request.body.order,
        address: request.body.address,
      })

    object.save().then(data=>{
        response.status(201).json(data);
    }).catch(error=>next(error))

}

module.exports.updateUser=(request,response,next)=>{
    let password;
    if (request.body.password != undefined){
        password = bcrypt.hashSync(request.body.password, salt);
      }
    User.updateOne(
        {_id:request.body.id},
        {
            $set:{
                fullName: request.body.fullName,
                password: password,
                email: request.body.email,
                phone: request.body.phone,
                cart_id: request.body.cart_id,
                order: request.body.order,
                'address.city': request.body.address.city,
                'address.street': request.body.address.street,
                'address.building': request.body.address.building,
                'address.governorate': request.body.address.governorate,
                'address.apartment': request.body.address.apartment,
                'address.postalCode': request.body.address.postalCode,
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

