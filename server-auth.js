require('dotenv').config()
const express = require('express')
const url = require('url');
const jwt = require('jsonwebtoken')
const verifyToken = require('./controllers/auth.controller')
const app = express()
app.use(express.urlencoded({extended:true}));
app.use(express.json())

const shajs = require('sha.js')
const pwdHasedLen = 64


// database
const userModel = require('./models/user.model')
const accountModel = require('./models/account.model')
let users = []

// app
const cors = require('cors')
app.use(cors());

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
	const password = req.body.password

	const user = await userModel.get(username);
	const salt = user.password.substring(pwdHasedLen)
    const passwordHased = shajs('sha256').update(password + salt).digest('hex') + salt
	if (!user) 	return res.redirect('http://localhost:3000/login')
	
	if(user.token==null && user.password === password){
		req.body={username: user.username}
		return res.redirect(url.format({
			pathname:"http://localhost:3000/change-password",
			query: {
				username: user.username,
			}
		}));
	}
	else if (user.password === passwordHased) {
		console.log("cac")
		const tokens = generateTokens(user)
		updateRefreshToken(username, tokens.refreshToken)

		const setToken = await userModel.updateToken(user.username, {"token":tokens.refreshToken})

		res.redirect(url.format({
			pathname:"http://localhost:3000/",
			query: {
			"a":1,
			"b":2,
			"token":tokens.accessToken,
			"refreshToken": tokens.refreshToken 
			}
		}));
		return;
		
	}
	else {
		
		return res.redirect('http://localhost:3000/login')
	}
    
	// const user = users.find(user => user.username === username)
    // console.log(user)
	
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

app.post('/change-password', async (req, res, next) => {
	req.body.username =  req.query.username
	const password = req.body.new_password 
	const username = req.body.username

	if (req.query.homepage) {
		const oldPass = req.body.old
		const user = await userModel.get(username);
		const salt = user.password.substring(pwdHasedLen)
    	const oldPasswordHased = shajs('sha256').update(oldPass + salt).digest('hex') + salt
		if (user.password !== oldPasswordHased){
			return res.json({
				status: false
			})
		}
	}
  
	const salt = Date.now().toString(16)
	console.log("hehe2",salt)

    const passwordHased = shajs('sha256').update(password + salt).digest('hex') + salt

	const rs = await accountModel.updatePassword(username, passwordHased)

	const user = await userModel.get(username);

	const tokens = generateTokens(user)
	updateRefreshToken(username, tokens.refreshToken)

	const setToken = await userModel.updateToken(user.username, {"token":tokens.refreshToken})

	if (req.query.homepage){
		return res.json({
			status: true
		})
	}

	res.redirect("http://localhost:3000/login")
	// res.redirect(url.format({
	// 	pathname:"http://localhost:3000/",
	// 	query: {
	// 	   "a": 1,
	// 	   "b": 2,
	// 	   "token":tokens.accessToken,
	// 	   "refreshToken": tokens.refreshToken 
	// 	 }
	//   }));
	
	return;
})

app.delete('/logout', verifyToken, (req, res) => {
	const user = users.find(user => user.id === req.userId)
	updateRefreshToken(user.username, null)

	res.sendStatus(204)
})

const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
module.exports = app;