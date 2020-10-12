const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const db = require('../model/Conversion')
module.exports = (app) => {

	// https://api.exchangeratesapi.io/latest?base=USD&symbols=USD   BRL, USD, EUR, JPY

	app.get('/conversion/all', (req, res) => {

		db.all("SELECT * FROM conversions", (err, results) => {
	
			res.json({
				results: results
			})
		})

	})	

	app.get('/conversion', (req, res) => {	
		
			try {	
				const OriginCurrency=  req.query.OriginCurrency
				const TargetCurrency=  req.query.TargetCurrency
				const OriginValue =  req.query.Value

				// Fetch Rates from API
				fetch(`https://api.exchangeratesapi.io/latest?base=${OriginCurrency}&symbols=${TargetCurrency}`)
				.then(result => {return result.json()}) 
				.then(data => {return rates = data.rates[TargetCurrency]})

				const TargetValue = OriginValue * rates
				const date = new Date(new Date().toUTCString())
				
				// DB Query
				db.insertConversion("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IlRlc3QiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifSwiaWF0IjoxNjAyNTEwMjkwfQ.gYYt-3CktBEQr3792lXyIJilrlMjQLaJCQ8v6HcvL08",
				OriginCurrency, OriginValue, TargetCurrency, rates, date );

				res.status(200).json({
					OriginCurrency,
					OriginValue,
					TargetCurrency,
					ConvertedValue: TargetValue,
					ConversionRate: rates,
					DateTimeUTC: date
					
				})
				
			} catch {
				res.sendStatus(404)
			}
	})

	app.post('/conversionSafe', verifyToken, (req, res) => {
		jwt.verify(req.token, 'sKey', (err, authData) => {

			try {	
				res.json({
					message: 'Success',
					authData
				})
				
			} catch {
				res.sendStatus(403)
			}			
		})
	
	})

	
	// Verify Token
	function verifyToken(req, res, next) {
		const bearerHeader = req.headers['authorization']
		if(typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ')
			const bearerToken = bearer[1]
			req.token = bearerToken
			next()
		} else {
			res.sendStatus(403)
		}
	}

	

}