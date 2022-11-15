const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

console.log(process.env.NODE_ENV);

//ability to recieve and send json
app.use(express.json());

app.use(cookieParser());

//build in middleware
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not found" });
	} else {
		res.type("txt").send("404 Not found");
	}
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running at port ${PORT}`);
});
