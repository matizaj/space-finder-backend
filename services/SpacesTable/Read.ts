import {DynamoDB} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult,Context} from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbCleint  = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult={
        statusCode: 200,
        body: 'hello from dynamodb'
    }
    
    try {
        if(event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters){
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        
        }else {
       result.body = await scanTable();
    }
    } catch (error) {
        if(error instanceof Error) result.body = error.message
    }
    return result;
    
}

    async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters  ) {
        const keyValue = queryParams[PRIMARY_KEY!];
        const queryResp = await dbCleint.query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: '#zz = :zzz',
            ExpressionAttributeNames: {
                '#zz': PRIMARY_KEY!
            },
            ExpressionAttributeValues: {
                ':zzz': keyValue
            }
        }).promise();
        return JSON.stringify(queryResp.Items);
    }

    async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters  ) {
        const queryKey = Object.keys(queryParams)[0];
        const queryValue = queryParams[queryKey];
        const queryResponse = await dbCleint.query({
            TableName: TABLE_NAME!,
            IndexName: queryKey,
            KeyConditionExpression: '#zz = :zzz',
            ExpressionAttributeNames: {
                '#zz': queryKey
            },
            ExpressionAttributeValues: {
                ':zzz': queryValue
            }
        }).promise();
        return JSON.stringify(queryResponse.Items)
    }
    
    async function scanTable() {
        const queryResponse = await dbCleint.scan({
            TableName: TABLE_NAME!
        }).promise();
        return JSON.stringify(queryResponse.Items);
    }

export{handler}