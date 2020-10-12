module.exports = (app) => {
	app.post('/login', (req, res) => {
		const user = {
			id: 1,
			username: 'Test',
			email: 'test@test.com'
		}
	
		jwt.sign({user: user}, 'sKey', (err, token) => {
			res.json({
				token
			})
		})
	})
}