import {DynamoDB, PI} from 'aws-sdk';
import {APIGatewayProxyEvent, APIGatewayProxyResult,Context} from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbCleint  = new DynamoDB.DocumentClient();

async function handler(event:APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> {

    const  result ={statusCode: 200, body: ''};
   const spaceId = event.queryStringParameters?.[PRIMARY_KEY!];

   try {
    if(spaceId) {
        const deletedResult = await dbCleint.delete({
            TableName: TABLE_NAME!,
            Key: {
                [PRIMARY_KEY!]: spaceId
            }
        }).promise();
        result.body = JSON.stringify(deletedResult)
       }
   } catch (error) {
    if (error instanceof Error) result.body = JSON.stringify(error?.message)
   }

   return result;
    
}

export{handler}