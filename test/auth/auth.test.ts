import {AuthService} from './AuthService';
import  {config} from './config'
import * as AWS from 'aws-sdk';


async function callUser() {
    const authService = new AuthService();
    const user  =await  authService.login(config.testUserName, config.testUserPassword);
    await authService.getTemporaryCreds(user);
    const someCreds = AWS.config.credentials;
    const a = 5;
    
}

callUser();