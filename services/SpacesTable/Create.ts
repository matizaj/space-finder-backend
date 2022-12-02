import {DynamoDB} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult,Context} from 'aws-lambda'
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME;
const dbCleint  = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult={
        statusCode: 200,
        body: 'hello from dynamodb'
    }

    const item2 = typeof event.body == 'object' ? event.body: JSON.parse(event.body);
    item2.spaceId = v4();

    const item ={
        spaceId: v4()
    }

    try {
        await dbCleint.put({
            TableName: TABLE_NAME!,
            Item: item2
        }).promise()
    } catch (error) {
        if(error instanceof Error) result.body = error.message
    }
    result.body = JSON.stringify(item2.spaceId);
    return result;
    
}

export{handler}