import {Stack, StackProps} from 'aws-cdk-lib'
import { Construct } from 'constructs';
import {Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda'
import {AuthorizationType, LambdaIntegration, MethodOptions, RestApi} from 'aws-cdk-lib/aws-apigateway'
import {join} from 'path'
import { GenericTable } from './GenericTable';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {AuthorizeWrapper} from './auth/AuthorizerWrapper';

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'SpaceApi');
    private authorizer: AuthorizeWrapper;
    // private spacesTable = new GenericTable('SpacesTable', 'spaceId', this);

    private spacesTable = new GenericTable(this, {
        tableName: 'SpacesTable', 
        primaryKey: 'spaceId', 
        createLambdaPath: 'Create', 
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        scondaryIndex: ['location']
    });

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props )
        this.authorizer = new AuthorizeWrapper(this, this.api)
        const helloLambdaNodejs = new NodejsFunction(this, 'helloLambdaNodejs', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler'
        })

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');
        helloLambdaNodejs.addToRolePolicy(s3ListPolicy);

        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }

        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodejs);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);

        //spaces api integrations
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
        spaceResource.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);
    }

}