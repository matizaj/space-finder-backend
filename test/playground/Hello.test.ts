import { APIGatewayProxyEvent } from 'aws-lambda';
import {handler} from '../../services/SpacesTable/Create'


const event: APIGatewayProxyEvent = {
    // queryStringParameters: {
    //     spaceId: 'cc177ba1-1ca7-42da-94b8-a17e34952428'
    // },
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