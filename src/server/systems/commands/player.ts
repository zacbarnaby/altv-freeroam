import * as alt from 'alt-server';
import { Chat } from '../chat/chat';
import { Log } from '../../utils';



Chat.registerCmd('login', async (player: alt.Player, password: string) => {

    if(!password.length)
        return Chat.send(player, '{E88388}Invalid usage: /login [password]'); 

    password = password.toString();
    
    if(player.isLogged) 
        return Chat.send(player, '{E88388}You are already logged in.');

    if(!player.accountData) 
        return Chat.send(player, '{E88388}No account exists.');

    const result = await player.login(password, player.accountData);
    
    if(!result)
        return Chat.send(player, '{E88388}Incorrect username or password. Please try again.');

        Chat.send(player, '{A8CC8C}You have succesfully logged in. Your account data has been restored.');
    
});

Chat.registerCmd('register', async (player: alt.Player, password: string) => {

    if(player.isLogged) 
        return Chat.send(player, '{E88388}You are already logged in.');

    if(player.accountData) 
        return Chat.send(player, '{E88388}You already have an account. Please /login.');

    const result = await player.create(password)
    
    if(!result)
        return Chat.send(player, '{E88388}An error occured trying to create your account. Please try again soon.');

    Chat.send(player, '{A8CC8C}You have succesfully created an account.');
    
});

Chat.registerCmd('delete', async (player: alt.Player) => {

    if(!player.isLogged) 
        return Chat.send(player, '{E88388}You are not logged in.');

    if(!player.accountData) 
        return Chat.send(player, '{E88388}No account exists.');

    const result = await player.delete();
    
    if(!result)
        return Chat.send(player, '{E88388}An error occured trying to delete your account. Please try again soon.');

    Chat.send(player, '{A8CC8C}You have succesfully deleted your account.');
    
});

Chat.registerCmd('pos', async (player: alt.Player) => {
    Log.object(`Pos: ${player.pos.x}, ${player.pos.y}, ${player.pos.z}`);
    Log.object(`Rot: ${player.rot.x}, ${player.rot.y}, ${player.rot.z}`);
});

Chat.registerCmd('gmx', (_player: alt.Player) => {
    alt.restartResource('freeroam');
});

