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

  const existsBillingAddress = await BillingAddress.exists({ userId: user.id });
  if (existsBillingAddress) {
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
    res.status(500).json({ error: "Internal server error" })
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
    res.status(500).json({ error: "Internal server error" })
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
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    await BillingAddress.findByIdAndDelete(billingAddress._id);
    res.status(200).json({
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

    //check if delivery address exists
    if (!deliveryAddress) {
      res.status(404).json({ errors: ["Endereço não encontrado"] });
      return;
    }

    //Check if Address belongs to user
    if (!deliveryAddress.userId.equals(reqUser._id)) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    await DeliveryAddress.findByIdAndDelete(deliveryAddress._id);
    res.status(200).json({
      id: deliveryAddress._id,
      message: "Endereço excluído com sucesso",
    });
  } catch (error) {
    res.status(404).json({ errors: ["Endereço não encontrado"] });
    return;
  }
};

//Get all Delivery Address of the logged-in user
const getAllUserDeliveryAddress = async (req, res) => {
  const reqUser = req.user;

  //confirms that the user is logged in

  const user = await User.findById(reqUser._id);

  try {
    const deliveryAddress = await DeliveryAddress.find({
      userId: user.id,
    }).exec();
    res.status(200).json(deliveryAddress);
  } catch (error) {
    res.status(404).json({ errors: ["Endereço não encontrado"] });
  }
};

//Get all Delivery Address of the logged-in user
const getUserBillingAddress = async (req, res) => {
  const reqUser = req.user;

  //confirms that the user is logged in

  const user = await User.findById(reqUser._id);

  try {
    const billingAddress = await BillingAddress.find({
      userId: user.id,
    }).exec();
    res.status(200).json(billingAddress);
  } catch (error) {
    res.status(404).json({ errors: ["Endereço não encontrado"] });
  }
};

//Get all Billing Address by user id
const getUserbyIdBillingAddress = async (req, res) => {
  //Checks the user's permission type
  const reqUser = req.user;
  const userAdmin = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");
  const userAdminandStaff = userAdmin.permissionType.includes(
    "admin" || "staff"
  );

  if(!userAdminandStaff){
    res.status(403).json({ error: "Permissão Negada" })
  }

  if (userAdminandStaff) {
    try {
      const {id} = req.params;

        const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
        "-password"
        );

        if(!user) {
          res.status(404).json({ errors: ["Usuário não encontrado"] });
        }

        try {
          const billingAddress = await BillingAddress.find({
            userId: user.id,
          }).exec();
          res.status(200).json(billingAddress);
        } catch (error) {
          res.status(404).json({ errors: ["Endereço não encontrado"] });
        }
        
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};



module.exports = {
  insertBillingAddress,
  insertDeliveryAddress,
  deleteBillingAddress,
  deleteDeliveryAddress,
  getAllUserDeliveryAddress,
  getUserBillingAddress,
  getUserbyIdBillingAddress,
};
