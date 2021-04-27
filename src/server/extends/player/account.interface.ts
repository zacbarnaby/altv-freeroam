import { Vector3 } from 'alt-server'

export interface AccountInterface extends Object {
    uid: number;
    username: string;
    hash: string;
    pos: Vector3;
    rot: Vector3;
 }