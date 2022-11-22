const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router
	.route("/")
	.get(userController.getAllUsers)
	.patch(userController.updateUser)
	.post(userController.createNewUser)
	.delete(userController.deleteUser);

module.exports = router;
