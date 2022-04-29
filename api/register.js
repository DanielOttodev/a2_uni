const ddb = require("../db");
// DynamoDb Client
const db = ddb.ddbClient;

exports.register = (req, res) => {
  let match = req.body.email;
  let body = {
    login: { S: req.body.login },
    user_name: { S: req.body.user_name },
    password: { S: req.body.password },
    email: { S: req.body.email },
  };
  try {
    // Lookup dynamodb table
    let params = {
      TableName: "login",
      ProjectionExpression: "email",
    };
    db.scan(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        res.send(err).status(500);
      } else {
        console.log("Route hit");
        if (data.Items == null) {
          res.send(false).status(200);
        } else {
          let found = false;
          let all = data.Items;
          console.log(all.length);
          let item;
          console.log(match);
          for (x = 0; x < all.length; x++) {
            if (all[x].email.S === match) {
              found = true;
              item = all[x].email.S;
              console.log(found);
              break;
            }
          }
          if (found) {
            // User already exists
            console.log("The email already exists", item);
            res.send("The email already exists").status(500);
          } else {
            // Create the user
            console.log("Unique user, creating...");
            try {
              let params = {
                TableName: "login",
                Item: body,
              };
              console.log("Start Write");
              db.putItem(params, function (err, data) {
                console.log("Putting");
                console.log(body);
                if (err) {
                  console.log(err);
                  res.send(err).status(500);
                } else {
                  console.log("Success");
                  res.send("true").status(200);
                }
              });
            } catch (error) {
              res.send(error).status(500);
            }
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
