const asyncHandler = require("express-async-handler");
const User = require("../models/Users");
const Note = require("../models/Notes");
const bcrypt = require("bcrypt");

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await Note.find().select().lean();
	if (!notes.length) {
		res.status(400).json({ message: "No notes found" });
	}

	res.json(notes);
});

const postNote = asyncHandler(async (req, res) => {
	const { user, title, text, completed } = req.body;

	if (!user || !title || !text) {
		res.status(400).json({ message: "User, title and text are required" });
	}
});

const updateNote = asyncHandler(async (req, res) => {});

const deleteNote = asyncHandler(async (req, res) => {});

module.exports = {
	getAllNotes,
	postNote,
	updateNote,
	deleteNote,
};
