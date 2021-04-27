
import * as alt from 'alt-server';

import './extends/player/alt-player.prototype';

import { Database } from './database/database';
import { Events } from './events';
import { Commands } from './systems/commands';
import { Log } from './utils';

const init = async () => {
    await Database.ready();
    await Events.ready();
    await Commands.ready();

    process.stdin.resume();

    process.on('SIGINT', () => {

        Log.error('Server', 'Server is shutting down.')
        alt.Player.all.forEach(async (player: alt.Player) => {

            if(!player.isLogged) return;

            Log.log(`Attempting to save ${player.name}.`)
            const result = await player.save();

            if(result)
                Log.log(`Saved ${player}.name`);
        });

        Log.success('All players saved, closing.');
        process.exit();

    });
}

init();