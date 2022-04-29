const ddb = require("../db");
const db = ddb.ddbClient;

exports.userDetail = (req, res) => {
  console.log(req.body);
  var params = {
    TableName: "login",
    Key: {
      email: { S: req.body.email },
    },
    //ProjectionExpression: req.body.email,
  };

  // Call DynamoDB to read the item from the table
  db.getItem(params, function (err, data) {
    if (err) {
      console.log(err);
      res.send(err).status(500);
    } else {
      console.log("Success", data.Item);
      res.send(data.Item).status(200);
    }
  });
};
