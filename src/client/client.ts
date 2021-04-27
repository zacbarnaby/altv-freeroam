import * as alt from 'alt-client'
import game from 'natives'

import { Camera } from './camara/camera'

import './chat';
import './client.events';

const player = alt.Player.local;
let spawnCamera = null;

export function SetAmbientZone() {
    game.setPedDefaultComponentVariation(player.scriptID);
    game.startAudioScene("FBI_HEIST_H5_MUTE_AMBIENCE_SCENE"); // Used to stop police sound in town
    game.cancelCurrentPoliceReport(); // Used to stop default police radio around/In police vehicle
    game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_GENERAL", true); // Turn off prison sound
    game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_WARNING", true); // Turn off prison sound
    game.clearAmbientZoneState("AZ_COUNTRYSIDE_PRISON_01_ANNOUNCER_ALARM", true); // Turn off prison sound
    game.clearAmbientZoneState("AZ_DISTANT_SASQUATCH", true);
    game.setAudioFlag("LoadMPData", true);
    game.setAudioFlag("DisableFlightMusic", true);
};

export function AuthCamera(state: boolean) {
    game.doScreenFadeIn(2000);
    game.setPlayerInvincible(player.scriptID, state);

    const _state = state ? false : true;
    game.displayRadar(_state);
    game.displayHud(_state);

    if(!state) 
        return spawnCamera.destroy();

    spawnCamera = new Camera(new alt.Vector3(266.9648, 1425.167, 238.3106), new alt.Vector3(-10, 0, 182.3031));
    spawnCamera.setActive(true);
}



