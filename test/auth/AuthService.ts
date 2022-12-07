import { Amplify, Auth } from 'aws-amplify';
import {config} from './config';
import {CognitoUser} from '@aws-amplify/auth';
import {Credentials} from 'aws-sdk/lib/credentials'
import * as AWS from 'aws-sdk'

Amplify.configure({
    Auth: {
        mandatorySignIn: false,
        region: config.region,
        userPoolId: config.userPoolId,
        userPoolWebClientId: config.appClientId,
        identityPoolId: config.identityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
})

export class AuthService {
    public async login(username: string, password: string) {
        const user = await Auth.signIn(username, password) as CognitoUser;
        return user;
    }
    public async getTemporaryCreds(user: CognitoUser) {
        const cognitoIdentityPool = `cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: config.identityPoolId,
            Logins: {
                [cognitoIdentityPool]: user.getSignInUserSession()!.getIdToken().getJwtToken()
            }
        }, {
            region: config.region
        })

        try {
            await this.refreshCreds();
        } catch (error) {
            console.log(error)
        }

    }

    private async refreshCreds(): Promise<void> {
       
        return new Promise((res:any, rej:any) =>{
            (AWS.config.credentials as Credentials).refresh(error => {
                if (error) {
                    rej(error)
                } else {
                    res();
                }
            })
        });
    }
}