const User = require("../models/User");
const BillingAddress = require("../models/BillingAddress");
const DeliveryAddress = require("../models/DeliveryAddress");
const mongoose = require("mongoose");


//Insert a billing Address, with an user related to it
const insertBillingAddress = async (req, res) => {
  const {
    billingAddress,
    billingNumber,
    billingAdditional,
    billingNeighborhood,
    billingCity,
    billingState,
    billingZipCode,
  } = req.body;

  const reqUser = req.user;

  //confirms that the user is logged in
  
  const user = await User.findById(reqUser._id);

  //Check if the user has a billing address
  
  const existsBillingAddress = await BillingAddress.exists({userId: user.id})
  if(existsBillingAddress) {
    res.status(404).json({ errors: ["Endereço já cadastrado"] });
      return;
  }

  //creates new billing address

  const newBillingAddress = await BillingAddress.create({
    billingAddress,
    billingNumber,
    billingAdditional,
    billingNeighborhood,
    billingCity,
    billingState,
    billingZipCode,
    userId: user._id,
  });

  //If billingAddress was creates sucessfully, return data
  if (!newBillingAddress) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde!"],
    });
  }

  res.status(201).json(newBillingAddress);
};

//Insert a delivery, with an user related to it
const insertDeliveryAddress = async (req, res) => {
  const {
    deliveryAddress,
    deliveryNumber,
    deliveryAdditional,
    deliveryNeighborhood,
    deliveryCity,
    deliveryState,
    deliveryZipCode,
  } = req.body;

  //confirms that the user is logged in
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

    //creates new delivery address
  const newDeliveryAddress = await DeliveryAddress.create({
    deliveryAddress,
    deliveryNumber,
    deliveryAdditional,
    deliveryNeighborhood,
    deliveryCity,
    deliveryState,
    deliveryZipCode,
    userId: user._id,
  });

  //If billingAddress was creates sucessfully, return data
  if (!newDeliveryAddress) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde!"],
    });
    return;
  }

  console.log;

  res.status(201).json(newDeliveryAddress);
};

//remove billing address from db
const deleteBillingAddress = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const billingAddress = await BillingAddress.findById(
      new mongoose.Types.ObjectId(id)
    );

    //check if photo exists
    if (!billingAddress) {
      res.status(404).json({ errors: ["Endereço não encontrado"] });
      return;
    }

    //Check if Address belongs to user
    if (!billingAddress.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["Ocorreu um erro tente novamente mais tarde"] });
      return;
    }

    await BillingAddress.findByIdAndDelete(billingAddress._id);
    res
      .status(200)
      .json({
        id: billingAddress._id,
        message: "Endereço excluído com sucesso",
      });
  } catch (error) {
    res.status(404).json({ errors: ["Endereço não encontrado"] });
    return;
  }
};

//remove delivery address from db
const deleteDeliveryAddress = async (req, res) => {
    const { id } = req.params;
    const reqUser = req.user;
  
    try {
      const deliveryAddress = await DeliveryAddress.findById(
        new mongoose.Types.ObjectId(id)
      );
  
      //check if photo exists
      if (!deliveryAddress) {
        res.status(404).json({ errors: ["Endereço não encontrado"] });
        return;
      }
  
      //Check if Address belongs to user
      if (!deliveryAddress.userId.equals(reqUser._id)) {
        res
          .status(422)
          .json({ errors: ["Ocorreu um erro tente novamente mais tarde"] });
        return;
      }
  
      await DeliveryAddress.findByIdAndDelete(deliveryAddress._id);
      res
        .status(200)
        .json({
          id: deliveryAddress._id,
          message: "Endereço excluído com sucesso",
        });
    } catch (error) {
      res.status(404).json({ errors: ["Endereço não encontrado"] });
      return;
    }
  };

  //Get all Address
  const getAllDeliveryAddress = async(req,res)=> {
  
  }

module.exports = {
  insertBillingAddress,
  insertDeliveryAddress,
  deleteBillingAddress,
  deleteDeliveryAddress,
  getAllDeliveryAddress
};
