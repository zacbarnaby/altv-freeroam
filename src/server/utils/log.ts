import chalk from 'chalk';

export const LogStruct = {
    getTime() {
        const today = new Date();
        return `[${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}]`;
    },

    log(...args: any) {
        console.log(`${this.getTime()} ${args}`);
    },

    object(...args: any) {
        console.log(`${this.getTime()} ${JSON.stringify(args)}`);
    },

    error(_type: String, ...args: any) {
        console.log(chalk.red(`${this.getTime()}[Error][${_type}]: ${args}`)); 
    },

    success(...args: any) {
        console.log(chalk.green(`${this.getTime()} ${args}`));
    }
}