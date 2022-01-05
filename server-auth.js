require('dotenv').config()
const express = require('express')
const url = require('url');
const jwt = require('jsonwebtoken')
const verifyToken = require('./controllers/auth.controller')
const app = express()
app.use(express.urlencoded({extended:true}));
app.use(express.json())

// database
const userModel = require('./models/user.model')
let users = []

// app

const generateTokens = payload => {
	const { username, password } = payload
    
	// Create JWT
	const accessToken = jwt.sign(
		{ username, password },
		"abc",
		{
			expiresIn: '5h'
		}
	)

	const refreshToken = jwt.sign(
		{ username, password },
		"def",
		{
			expiresIn: '1h'
		}
	)

	return { accessToken, refreshToken }
}

const updateRefreshToken = (username, refreshToken) => {
	users = users.map(user => {
		if (user.username === username)
			return {
				...user,
				refreshToken
			}

		return user
	})
}

app.post('/login', async (req, res) => {
	const username = req.body.username
	console.log("Username in req: ", username)
	const user = await userModel.get(username);
	console.log("User in DB:      ", user)

    
	// const user = users.find(user => user.username === username)
    // console.log(user)
	if (!user) return res.sendStatus(401)

	const tokens = generateTokens(user)
	updateRefreshToken(username, tokens.refreshToken)

	const setToken = await userModel.update(user, {"token":tokens.refreshToken})

	// res.redirect("http://localhost:3000/?token="+tokens.accessToken+"?refreshToken="+tokens.)
	res.redirect(url.format({
		pathname:"http://localhost:3000/",
		query: {
		   "a": 1,
		   "b": 2,
		   "token":tokens.accessToken,
		   "refreshToken": tokens.refreshToken 
		 }
	  }));
	return;
})

app.post('/token', (req, res) => {
	const refreshToken = req.body.refreshToken
	if (!refreshToken) return res.sendStatus(401)

	const user = users.find(user => user.refreshToken === refreshToken)
	if (!user) return res.sendStatus(403)

	try {
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

		const tokens = generateTokens(user)
		updateRefreshToken(user.username, tokens.refreshToken)

		res.json(tokens)
	} catch (error) {
		console.log(error)
		res.sendStatus(403)
	}
})

app.delete('/logout', verifyToken, (req, res) => {
	const user = users.find(user => user.id === req.userId)
	updateRefreshToken(user.username, null)

	res.sendStatus(204)
})

const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
module.exports = app;