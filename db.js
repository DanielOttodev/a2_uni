const { DynamoDB } = require("@aws-sdk/client-dynamodb");
// Set the AWS Region.
const REGION = "ap-southeast-2"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDB({ region: REGION });
module.exports = { ddbClient };
