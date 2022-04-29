const ddb = require("../db");
// DynamoDb Client
const db = ddb.ddbClient;

exports.auth = (req, res) => {
  let match = req.body.email;
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
            } else {
              console.log("No match");
            }
          }
          if (found) {
            console.log("Found and sending: ", item);
            res.send(item).status(200);
          } else {
            console.log("None found");
            res.send(false).status(200);
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};
