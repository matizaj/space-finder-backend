import { APIGatewayProxyEvent } from 'aws-lambda';
import {handler} from '../../services/SpacesTable/Update'


const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        spaceId: '4868e331-d180-4cc1-92e6-03f84361288c'
    },
    body: {
        location: 'Adlitzgraben'
    }
} as any;
// const event: APIGatewayProxyEvent = {
//     queryStringParameters: {
//         spaceId: '89855466-d2f1-4e7d-abd0-3711e10b451c'
//     }
// } as any;

const result = handler(event as any,{} as any).then(data => {
    console.log(data);
    const items = JSON.parse(data.body);
    console.log('123')
})