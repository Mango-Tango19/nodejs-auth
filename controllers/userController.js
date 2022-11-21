const asyncHandler = require("express-async-handler");
const User = require("../models/Users");
const Notes = require("../models/Notes");
const bcrypt = require("bcrypt");

///get all users, GET /users, make private
const getAllUsers = asyncHandler(async (req, res) => {});

/// POST /users, make private
const postNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;

	if (!username || !password || !roles.isArray()) {
		res.status(400).json({ message: "All fields are required" });
	}

	///check for duplicate
	const duplicate = await User.findOne({ username }).lean().exec(); ///lean - return JS obj, not Mongose Doc

	if (duplicate) {
		res.status(409).json({ message: "User alredy exist" });
	}

	///hash password
	const hashed = await bcrypt.hash(password, 10);

	const userObj = { username, password: hashed, roles };

	const user = User.create(userObj);

	if (user) {
		///created
		res.status(201).json({ message: "New user created" });
	} else {
		res.status(400).json({ message: "Invalid user data recieved" });
	}
});

/// DELETE /users, make private
const deleteUser = asyncHandler(async (req, res) => {});

/// UPDATE /users, make private
const updateUser = asyncHandler(async (req, res) => {
	const { id, username, password, roles, active } = req.body;

	if (
		!username ||
		!password ||
		!Array.isArray(roles) ||
		!id ||
		typeof active !== "boolean"
	) {
		res.status(400).json({ message: "All fields are required" });
	}

	const user = await User.findById(id).exec();

	if (!user) {
		res.status(400).json({ message: "User not found" });
	}

	const duplicate = User.findOne({ username }).lean().exec();

	//avoid change the current user working with
	if (duplicate && duplicate?.id !== id) {
		res.status(409).json({ message: "Duplicate username" });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		user.password = await bcrypt(password, 10);
	}

	const updatedUser = await user.save();

	res.json({ message: "User was updated" });
});

module.exports = userController;
