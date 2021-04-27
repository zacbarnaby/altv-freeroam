import * as alt from 'alt-client';
//import * as game from 'natives';
import { pushMessage } from './chat'

import { AuthCamera, SetAmbientZone } from './client';

alt.on('connectionComplete', () => {
    SetAmbientZone();
    AuthCamera(true);
});

alt.onServer('stopAuthCamera', () => {
    AuthCamera(false);
});

alt.on('keyup', (key: number) => {
    if(key == 85) {
        pushMessage('Player', '{FF0000}test');
    }
});