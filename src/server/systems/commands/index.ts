import './player';

import { Log } from '../../utils';

export const Commands = {
	"ready": async function() {
		Log.success(`* Commands has been loaded.`);
	}
}