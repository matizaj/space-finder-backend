import {Stack, StackProps} from 'aws-cdk-lib'
import { Construct } from 'constructs';
import {Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda'
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import {join} from 'path'
import { GenericTable } from './GenericTable';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack {
    private api = new RestApi(this, 'SpaceApi');
    // private spacesTable = new GenericTable('SpacesTable', 'spaceId', this);

    private spacesTable = new GenericTable(this, {
        tableName: 'SpacesTable', 
        primaryKey: 'spaceId', 
        createLambdaPath: 'Create', 
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        scondaryIndex: ['location']
    });

    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props )

        const helloLambdaNodejs = new NodejsFunction(this, 'helloLambdaNodejs', {
            entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler'
        })

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');
        helloLambdaNodejs.addToRolePolicy(s3ListPolicy);

        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodejs);
        const helloLambdaResource = this.api.root.addResource('hello');
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);

        //spaces api integrations
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
    }

}