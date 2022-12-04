import {DynamoDB} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult,Context} from 'aws-lambda'
import {validateAsSpaceEntry, MissingFieldError} from '../shared/inputValidator'
import {generateRandomId, getEventBody} from '../shared/Utils'

const TABLE_NAME = process.env.TABLE_NAME;
const dbCleint  = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult={
        statusCode: 200,
        body: 'hello from dynamodb'
    }

    
    try {
        const item2 = getEventBody(event)
        item2.spaceId = generateRandomId();
        validateAsSpaceEntry(item2);
        await dbCleint.put({
            TableName: TABLE_NAME!,
            Item: item2
        }).promise()
        result.body = JSON.stringify(item2.spaceId);
    } catch (error) {
        if(error instanceof MissingFieldError) {
            result.statusCode = 403;
            result.body = error.message;
        }else if(error instanceof Error) {
            result.statusCode = 500;
            result.body = error.message;
        }
    }
    return result;
     
}

export{handler}