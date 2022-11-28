const asyncHandler = require("express-async-handler");
const User = require("../models/Users");
const Note = require("../models/Notes");

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await Note.find().lean();
	if (!notes.length) {
		res.status(400).json({ message: "No notes found" });
	}

	const notesWithUsers = await Promise.all(
		notes.map(async (note) => {
			const user = await User.findById(note.user).lean().exec();
			return { ...note, username: user.username };
		})
	);

	res.json(notesWithUsers);
});

const createNewNote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body;

	if (!user || !title || !text) {
		res.status(400).json({ message: "User, title and text are required" });
	}

	//check for duplicates

	const duplicate = await Note.findOne({ title }).lean().exec();

	if (!duplicate) {
		res.status(409).json({
			message: `Note with title ${title} is already exist`,
		});
	}

	const note = await Note.create({ user, title, text });

	if (note) {
		res.status(201).json({
			message: `Note with title ${title} was created`,
		});
	} else {
		res.status(400).json({ message: "Invalid note data recieved" });
	}
});

const updateNote = asyncHandler(async (req, res) => {
	const { userId, title, text, completed, id } = req.body;

	if (!userId || !title || !text) {
		res.status(400).json({ message: "User, title and text are required" });
	}

	const note = await Note.findById(id).exec();

	if (!note) {
		res.status(400).json({ message: `Note with id ${id} wasnt found` });
	}

	const duplicate = Note.findOne({ title }).lean().exec();

	if (duplicate && duplicate?._id.toString() !== id) {
		res.status(409).json({
			message: "Duplicate note, two notes with same title",
		});
	}
});

const deleteNote = asyncHandler(async (req, res) => {});

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
};
