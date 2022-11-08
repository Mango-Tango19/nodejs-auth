const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

const logEvents = async (message, logfile) => {
	const dateTime = `${format(new Date(), "dd/MM/yyyy\tHH:mm:ss")}`;
	const logitem = `${dateTime} \t ${uuid()} \t ${message} \n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}

		await fsPromises.appendFile(
			path.join(__dirname, "..", "logs", logfile),
			logitem
		);
	} catch (err) {
		console.log(err);
	}
};

const logger = (req, res, next) => {
	logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
	console.log(`${req.method} \t ${req.url}`);

	next();
};

module.exports = { logEvents, logger };
