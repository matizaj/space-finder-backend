import { App } from 'aws-cdk-lib';
import { SpaceStack} from './SpaceStack';

const app = new App();
const spaceStack = new SpaceStack(app, 'Space-finder', {
    stackName: 'SpaceFinder'
})