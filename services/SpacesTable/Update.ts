import {DynamoDB} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult,Context} from 'aws-lambda'
import { getEventBody } from '../shared/Utils';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbCleint  = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> {

    const  result ={statusCode: 200, body: ''};
    try {
        const requestBody = getEventBody(event);
        const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];
     
        if(spaceId && requestBody) {
         const requestBodyKey = Object.keys(requestBody)[0];
         const requestBodyValue = requestBody[requestBodyKey];
     
         const updateResult = await dbCleint.update({
             TableName: TABLE_NAME!,
             Key: {
                 [PRIMARY_KEY!]: spaceId
             },
             UpdateExpression: 'set #zzzNew= :new',
             ExpressionAttributeValues: {
                 ':new':requestBodyValue
             },
             ExpressionAttributeNames: {
                 '#zzzNew': requestBodyKey
             },
             ReturnValues: 'UPDATED_NEW'
         }).promise();
     
         result.body = JSON.stringify(updateResult);
        }
    } catch (error) {
        if (error instanceof Error) result.body = JSON.stringify(error?.message)
    }

   return result;
    
}

export{handler}