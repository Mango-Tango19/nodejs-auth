const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: {
		message:
			"Too many login attempt from this IP, please try again after a 60 seconds pause ",
	},
	handler: (req, res, next, opt) => {
		logEvents(
			`Too many requests ${opt.message.message}\t${req.method}\t${req.url}`,
			"errLog.log"
		);
		res.status(opt.statusCode).send(opt.message);
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
