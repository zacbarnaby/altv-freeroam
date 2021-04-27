import './player.events';

import { Log } from '../utils';

export const Events = {
	"ready": async function() {
		Log.success(`* Events has been loaded.`);
	}
}