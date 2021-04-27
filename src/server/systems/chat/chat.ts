import * as alt from 'alt-server';
import { Log } from '../../utils';

let commandHandlers = {};

const invokeCommand = (player: alt.Player, cmd: string, args: any) => {
    cmd = cmd.toLowerCase();
    const callback = commandHandlers[cmd];

    if(callback) callback(player, args);
    else Chat.send(player, `{FF0000}Error: {FFFFFF}Unknown command /${cmd}`);
}

alt.onClient('chat:handleMessage', (player: alt.Player, msg: string) => {
    
    // Check if string is a command
    if(msg[0] === '/') {

        // Remove slash from command
        msg = msg.trim().slice(1);

        if(msg.length > 0) {
            Log.log(`[Command]: ${player.name}: /${msg}`);

            let args = msg.split(' ');
            const cmd = args.shift();

            invokeCommand(player, cmd, args);
        }
    } else {
        
        msg = msg.trim();

        if(msg.length > 0) {
            Log.log(`[Chat]: ${player.name}: ${msg}`);
            
            // Send message to client to display
            alt.emitClient(null, 'chat:sendMessage', player.name, msg.replace(/</g, '&lt;').replace(/'/g, '&#39').replace(/"/g, '&#34'));
        }
    }
});

export const Chat = { 

    send(player: alt.Player, message: string) {
        alt.emitClient(player, 'chat:sendMessage', null, message);
    },

    sendAll(message: string) {
        this.send(null, message);
    },

    registerCmd(cmd: string, callback: Function) {
        cmd = cmd.toLowerCase();
        if(commandHandlers[cmd] !== undefined) Log.error('COMMAND', `Failed to register command /${cmd}, already registered.`);
        else commandHandlers[cmd] = callback;
    }
   
}