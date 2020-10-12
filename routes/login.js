const jwt = require('jsonwebtoken')

module.exports = (app) => {
	app.post('/login', (req, res) => {
		const user = {
			username: req.body.username,
			email: req.body.username
		}
	
		jwt.sign({user: user}, 'sKey', (err, token) => {
			res.json({
				token
			})
		})
	})
}