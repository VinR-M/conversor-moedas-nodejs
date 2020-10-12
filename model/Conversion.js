	const sqlite3 = require('sqlite3').verbose();
	const db = new sqlite3.Database('./conversions.sql');

		db.dropConversionDB = () => {
			db.run("DROP TABLE conversions");
		}
	 
		db.createConversionDB = () => {
			db.run("CREATE TABLE conversions (TransactionID integer primary key , UserId varchar(255), OriginCurrency TEXT, OriginValue TEXT, TargetCurrency TEXT, ConversionRate TEXT, DateTimeUTC varchar(70))");
		}
	
		  
		db.insertConversion = (UserId,OriginCurrency, OriginValue, TargetCurrency, ConversionRate, DateTimeUTC) => {
			const stmt = db.prepare("INSERT INTO conversions (UserId, OriginCurrency, OriginValue, TargetCurrency, ConversionRate, DateTimeUTC) VALUES (?,?,?,?,?,?)");
		
			stmt.run(UserId,OriginCurrency, OriginValue, TargetCurrency, ConversionRate, DateTimeUTC);
			
			stmt.finalize();

		}
				
		  db.selectConversions = () => {
			db.each("SELECT * FROM conversions", function(err, row) {
				console.log({
					TransactionID: row.TransactionID,
					UserId: row.UserId,
					OriginCurrency: row.OriginCurrency,
					OriginValue: row.OriginValue,
					TargetCurrency: row.TargetCurrency,
					TargetValue: row.TargetValue,
					ConversionRate: row.ConversionRate,
					DateTimeUTC: row.DateTimeUTC
				})
			})

		  }
		
	
		module.exports = db
