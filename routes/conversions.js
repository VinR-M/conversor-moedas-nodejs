const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const db = require('../model/Conversion')

module.exports = (app) => {

	app.get('/conversion/all', verifyToken, (req, res) => {
		jwt.verify(req.token, 'sKey', (err, authData) => {
			if(err) res.sendStatus(403)	

			db.all("SELECT * FROM conversions WHERE UserID = '"+ req.token +"'", (err, results) => {
	
				res.json({
					results: results
				})
			})
		})
	})	

	app.get('/conversion', verifyToken, (req, res) => {	

		jwt.verify(req.token, 'sKey', (err, authData) => {
			if(err) res.sendStatus(403)	

			try {	
				const OriginCurrency=  req.query.OriginCurrency
				const TargetCurrency=  req.query.TargetCurrency
				const OriginValue =  req.query.Value

				// Fetch Rates from API
				fetch(`https://api.exchangeratesapi.io/latest?base=${OriginCurrency}&symbols=${TargetCurrency}`)
				.then(result => {return result.json()}) 
				.then(data => {return rates = data.rates[TargetCurrency]})

				let ConversionRates = rates

				const TargetValue = OriginValue * ConversionRates
				const date = new Date(new Date().toUTCString())
				
				// DB Query
				db.insertConversion(req.token, OriginCurrency, OriginValue, TargetCurrency, ConversionRates, date );

				res.status(200).json({
					UserID: req.token,
					OriginCurrency,
					OriginValue,
					TargetCurrency,
					ConvertedValue: TargetValue,
					ConversionRates,
					DateTimeUTC: date					
				})				
			} 
			
			catch {
				res.sendStatus(400)
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