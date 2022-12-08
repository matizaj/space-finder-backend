import {AuthService} from './AuthService';
import  {config} from './config'
import * as AWS from 'aws-sdk';

AWS.config.region = config.region;
async function getBuckets() {
    let buckets;
    try {
        buckets = new AWS.S3().listBuckets().promise();
    } catch (error) {
        buckets = undefined;
    }

    return buckets;
    
}
async function callUser() {
    const authService = new AuthService();
    const user  =await  authService.login(config.testUserName, config.testUserPassword);
    await authService.getTemporaryCreds(user);
    const someCreds = AWS.config.credentials;
    const buckets = await getBuckets();
    const a = 5;
    
}

callUser();