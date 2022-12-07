import { APIGatewayProxyEvent } from 'aws-lambda';
import {S3} from 'aws-sdk';

const s3Client = new S3();

async function handler(event:any, context: any) {
    const baukets = await s3Client.listBuckets().promise();
    console.log('receive a event');
    if(isAuthorized(event)) {
        return {
            statusCode:200,
            body: JSON.stringify(event)
        }
    }
    return {
        statusCode:401,
        body: 'Not authorized'
    }
}

const isAuthorized=(event: APIGatewayProxyEvent)=>{
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if(groups) {
        return (groups as string).includes('admins');
    } else {
        return false;
    }
}

export {handler}