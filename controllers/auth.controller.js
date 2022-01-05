const jwt = require('jsonwebtoken')
const session = require('express-session');

const verifyToken = (req, res, next) => {
	if(1){
		const authHeader = req.header('Authorization')
		console.log("Auth header: ", authHeader)
		// const authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJqaW0iLCJpYXQiOjE2NDA4NDk4MDEsImV4cCI6MTY0MDg1MjgwMX0.8QXeKbGggmyS08xmBDQLph2RRzwJJmfVIXShCajsaLM"
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) return res.sendStatus(401)

		try {
			const decoded = jwt.verify(token, "abc")

			req.userId = decoded.id
			next()
		} catch (error) {
			console.log(error)
			return res.sendStatus(403)
		}
	} else {
		res.json("Not access token")
		next()
	}
	
}

module.exports = verifyToken