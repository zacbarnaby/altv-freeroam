import { AccountInterface } from "./account.interface";

export interface PlayerInterface {
    accountData: AccountInterface;
    isLogged: boolean;
    
    findAccount(): Promise<any>;
    create(password: string): Promise<boolean>;
    login(password: string, account: AccountInterface): Promise<boolean>;
    delete(): Promise<boolean>;
    load(): void;
    save(): Promise<boolean>;
}