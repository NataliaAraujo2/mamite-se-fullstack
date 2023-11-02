const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password, permissionType } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ errors: ["Por favor, utilize outro email"] });
    return;
  }
  //Determines the initial value of permissionType

  if (permissionType === "") {
    permissionType = "customer";
  }

  //creates the array of permission types
  const permissionTypeArray = [];
  permissionTypeArray.push(permissionType);

  //Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
    permissionType: permissionTypeArray,
  });

  //If user was created successfuly return the token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
  }

  res.status(201).json({
    _id: newUser._id,
    permissionType,
    token: generateToken(newUser._id),
  });
};

//Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //Check if passwors matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha inválida."] });
    return;
  }

  //Return user with token
  res.status(201).json({
    _id: user._id,
    permissionType: user.permissionType,
    token: generateToken(user._id),
  });
};

//Get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

//Update an user
const updateCurrentUser = async (req, res) => {
  const { name, password } = req.body;

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
  }

  await user.save();

  res.status(200).json(user);
};

//Get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
      "-password"
    );

    //Check if user exists
    if (!user) {
      res.status(404).json({ errors: ["Usuário não encontrado."] });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
  }
};

//update user by id
const updateUserById = async (req, res) => {
  //Checks the user's permission type
  const reqUser = req.user;
  const userAdmin = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");
  const userAdminPermission = userAdmin.permissionType.includes("admin");

  if (userAdminPermission === true) {
    //Get user by id
    const { id } = req.params;
    const { permissionType } = req.body;

    try {
      const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
        "-password"
      );
      // Change user permission
      if (user) {
        const verifyUserPermission =
          user.permissionType.includes(permissionType);
        if (verifyUserPermission === true) {
          res.status(422).json({ errors: ["Permissão já concedida!"] });
          return;
        } else {
          user.permissionType.push(permissionType);
        }
      } else {
        res.status(404).json({ errors: ["Usuário não encontrado."] });
        return;
      }

      await user.save();

      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ errors: ["Id não encontrado."] });
    }
  } else {
    res.status(401).json({ errors: ["Acesso Negado."] });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  getUserById,
  updateUserById,
};
