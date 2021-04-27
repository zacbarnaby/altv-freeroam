import { Log } from '../../utils';
import { AccountInterface } from './account.interface';

export class SavePlayer { 

    accountData: AccountInterface;

    constructor(data: AccountInterface) {
        this.accountData = data;
    }

    get get() {
        return this.accountData;
    }

    destroy() {
        Log.log(`Account ${this.accountData.username} has been saved.`)
        delete this.accountData;
    }
}