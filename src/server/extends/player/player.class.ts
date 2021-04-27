import * as alt from 'alt-server';

import { SavePlayer } from './player.save';
import { PlayerInterface } from './player.interface';
import { Database } from '../../database/database'
import { Log } from '../../utils';
import { ERROR_TYPE } from '../../config/constants';
import { AccountInterface } from './account.interface';

import bcrypt from 'bcryptjs'


export class PlayerClass extends alt.Player implements PlayerInterface {

    public accountData: AccountInterface;
    public isLogged: boolean = false;

    public async findAccount(): Promise<any> {
        const [rows] = await Database.this.execute('SELECT * FROM `accounts` WHERE `username` = ?', [this.name]);
        return rows[0];
    }

    public async create(password: string): Promise<boolean> {
        let hashedPassword = await bcrypt.hash(password, 2);

        if(!hashedPassword.length) {
            Log.error(ERROR_TYPE.SERVER, `An error occured hashing password for ${this.name}.`);
            return false;
        }

        const rows = await Database.this.execute('INSERT INTO `accounts` (username, hash) VALUES (?, ?)', [this.name, hashedPassword]);
        if(rows['affectedRows'] == 0) {
            Log.error(ERROR_TYPE.MYSQL, `An error occured creating account for ${this.name}`);
            return false;
        }

        this.isLogged = true;
        this.spawn(0, 0, 0, 0);

        Log.success(`An account has been created for ${this.name}.`);
        return true;
    }

    public async login(password: string, account: AccountInterface): Promise<boolean> {
        const correctPassword = await bcrypt.compare(password, account.hash);
        
        if(!correctPassword) {
            return false;
        }

        Log.success(`${this.name} has logged in.`);

        this.load();
        return true;
    }

    public async delete(): Promise<boolean> {   
        const rows = await Database.this.execute('DELETE FROM `accounts` WHERE `username` = ?', [this.name]);

        if(rows['affectedRows'] == 0) {
            Log.error(ERROR_TYPE.MYSQL, `An error occured deleting account for ${this.name}`);
            return false;
        }

        Log.success(`An account has been deleted for ${this.name}.`);
        return true;
    }

    public load() {

        this.isLogged = true;
   
        if(this.accountData.pos.length == 0) {
            this.spawn(18.316484451293945, 10.298901557922363, 70.4608154296875, 0);
            this.rot = new alt.Vector3(0, 0, 2.770538568496704);
            return;
        }

        let parsedPos = JSON.parse(<any>this.accountData.pos);
        this.accountData.pos = new alt.Vector3(parsedPos.x, parsedPos.y, parsedPos.z);

        let parsedRot = JSON.parse(<any>this.accountData.rot);
        this.accountData.rot = new alt.Vector3(parsedRot.x, parsedRot.y, parsedRot.z);

        this.spawn(this.accountData.pos.x, this.accountData.pos.y, this.accountData.pos.z, 0);
        this.rot = new alt.Vector3(this.accountData.rot.x, this.accountData.rot.y, this.accountData.rot.z);
    
        alt.emitClient(this, 'stopAuthCamera');
        Log.log(`${this.name} has been loaded.`);
    }

    public async save(): Promise<boolean> {
        const account = new SavePlayer(this.accountData);

        const lastPosition = JSON.stringify(this.pos);
        const lastRotation = JSON.stringify(this.rot);
        const rows = await Database.this.execute('UPDATE `accounts` SET `pos` = ?, `rot` = ? WHERE `uid` = ?', [lastPosition, lastRotation, account.accountData.uid])

        if(rows['affectedRows'] == 0) {
            Log.error(ERROR_TYPE.MYSQL, `An error occured saving account ${account.accountData.username}`);
            return false;
        }

        account.destroy();
        return true;
    }
}

