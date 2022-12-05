import { Amplify, Auth } from 'aws-amplify';
import {config} from './config';
import {CognitoUser} from '@aws-amplify/auth';

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.appClientId,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

export class AuthService {
    public async login(username: string, password: string) {
        const user = await Auth.signIn(username, password) as CognitoUser;
        return user;
    }
}