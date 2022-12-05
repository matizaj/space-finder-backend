import { CfnOutput } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class AuthorizeWrapper {
    private userPool: UserPool;
    private userPoolClient: UserPoolClient;
    public authorizer: CognitoUserPoolsAuthorizer;

    constructor(public scope: Construct, public api: RestApi){
        this.initialize();
    }

    private initialize() {
        this.createUserPool();
    }
    createUserPool() {
        this.userPool = new UserPool(this.scope, 'SpaceUserPool', {
            userPoolName: 'SpaceUserPool',
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });
        new CfnOutput(this.scope, 'UserPoolId', {
            value: this.userPool.userPoolId
        })
    }
}