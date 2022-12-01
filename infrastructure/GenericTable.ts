import { Stack } from 'aws-cdk-lib';
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';
export class GenericTable {
    private table: Table;
  constructor(public name: string, public primaryKey: string, public stack: Stack) {
    this.initalize();
   
  }

  private initalize() {
    this.createTable();
  }

  private createTable(){
    this.table = new Table(this.stack, this.name, {
        partitionKey: {
            name: this.primaryKey,
            type: AttributeType.STRING
        },
        tableName: this.name
    })
  }
}