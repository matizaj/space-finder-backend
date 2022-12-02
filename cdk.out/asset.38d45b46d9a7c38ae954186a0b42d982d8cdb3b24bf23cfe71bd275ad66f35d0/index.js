"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// services/SpacesTable/Read.ts
var Read_exports = {};
__export(Read_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(Read_exports);
var import_aws_sdk = require("aws-sdk");
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
var dbCleint = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "hello from dynamodb"
  };
  let queryResponse;
  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY];
        const queryResp = await dbCleint.query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "#zz = :zzz",
          ExpressionAttributeNames: {
            "#zz": PRIMARY_KEY
          },
          ExpressionAttributeValues: {
            ":zzz": keyValue
          }
        }).promise();
        result.body = JSON.stringify(queryResp);
      }
    }
    queryResponse = await dbCleint.scan({
      TableName: TABLE_NAME
    }).promise();
  } catch (error) {
    if (error instanceof Error)
      result.body = error.message;
  }
  result.body = JSON.stringify(queryResponse);
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
