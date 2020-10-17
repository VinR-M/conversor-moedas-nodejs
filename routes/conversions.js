const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const db = require("../model/Conversion");

module.exports = (app) => {
  app.get("/conversion/all", verifyToken, (req, res) => {
    jwt.verify(req.token, "sKey", (err, authData) => {
      if (err) res.status(403).send({ error: "User not authenticated" });

      db.all(
        "SELECT * FROM conversions WHERE UserID = '" + req.token + "'",
        (err, results) => {
          if (err) throw err;

          res.json({
            results: results,
          });

          console.log("Data selected from database.");
        }
      );
    });
  });

  app.get("/conversion", verifyToken, (req, res) => {
    jwt.verify(req.token, "sKey", (err, authData) => {
      if (err) res.status(403).send({ error: "User not authenticated" });

    
        const OriginCurrency = req.query.OriginCurrency;
        const TargetCurrency = req.query.TargetCurrency;
        const OriginValue = req.query.Value;

        // Fetch Rates from API
        fetch(
          `https://api.exchangeratesapi.io/latest?base=${OriginCurrency}&symbols=${TargetCurrency}`
        )
          .then((result) => {
            console.log("Data fetched from API.");
            return result.json();
          })
          .then((data) => {
            return (ConversionRates = data.rates[TargetCurrency]);
          })
          .then(() => {
            const TargetValue = OriginValue * ConversionRates;
            const date = new Date(new Date().toUTCString());

            // DB Query
            db.insertConversion(
              req.token,
              OriginCurrency,
              OriginValue,
              TargetCurrency,
              ConversionRates,
              date
            );

            res.status(200).json({
              UserID: req.token,
              OriginCurrency,
              OriginValue,
              TargetCurrency,
              ConvertedValue: TargetValue,
              ConversionRates,
              DateTimeUTC: date,
            });

            console.log("Data saved to database.");
		  })
		  .catch(() => { 
			  res.status(400).send({ error: "Failed to convert value" })
			  console.log('API fetch failed')
			  } )        
     
    });
  });

  // Verify Token
  function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(403).send({ error: "User not authenticated" });
    }
  }
};
