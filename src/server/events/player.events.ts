import * as alt from 'alt-server';
import { Chat } from '../systems/chat/chat';

import { Log } from '../utils';

alt.on('playerConnect', async (player: alt.Player) => {
    Log.log(`${player.name} has joined the server.`);
});

alt.on('playerDisconnect', async (player: alt.Player, reason: string) => {
    Log.log(`${player.name} has left the server.`);
    Chat.sendAll(`* ${player.name} has left the server. Reason: ${reason}`);

    if(player.isLogged) {
        player.save();
    }
});

alt.onClient('playerReady', async (player: alt.Player) => {
    Chat.sendAll(`* {A8CC8C}${player.name} {FFFFFF}has joined the server.`);
    const account = await player.findAccount();

    if(typeof account !== 'undefined') {
        Chat.send(player, `Welcome back {A8CC8C}${player.name}{FFFFFF}. Type /login [password] to authenticate your account.`);
        player.accountData = account;
    } else { 
        Chat.send(player, `Welcome {A8CC8C}${player.name}{FFFFFF}. Type /register [password] to create an account.`);
    }   
});
