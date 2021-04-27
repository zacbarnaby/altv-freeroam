import * as alt from 'alt-client';
import * as game from 'natives';

export class Camera {
    handle: number;
    pos: alt.Vector3;
    rot: alt.Vector3;
    fov: number;

    constructor(pos: alt.Vector3, rot: alt.Vector3, fov: number = 50) {
        this.pos = pos;
        this.rot = rot;
        this.fov = fov;
        this.handle = game.createCameraWithParams(game.getHashKey("DEFAULT_SCRIPTED_CAMERA"), this.pos.x, this.pos.y, this.pos.z, this.rot.x, this.rot.y, this.rot.z, this.fov, true, 2);
    }

    setActive(state: boolean) {
        game.setCamActive(this.handle, state);
        game.renderScriptCams(state, false, 0, true, false, 0);

        if(state) 
            game.setFocusPosAndVel(this.pos.x, this.pos.y, this.pos.z, 100, 100, 1000) 
        else 
            game.clearFocus();
    }

    destroy() {
        this.setActive(false);
        game.destroyCam(this.handle, true);
    }
}