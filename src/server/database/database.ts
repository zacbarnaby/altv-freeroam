import * as mysql from 'mysql2/promise';
import { Log } from '../utils';
import { ERROR_TYPE } from '../config/constants';

const database = await mysql.createConnection({
    host: "0.0.0.0",
    user: "root",
    password: "root",
    database: "altv"
});

database.connect()
    .then(() => {
        Log.success('MySQL: Connected succesfully.');
    })
    .catch((err) => {
        if(err) {
            Log.error(ERROR_TYPE.MYSQL, err.message);
            Log.error(ERROR_TYPE.SERVER, 'An error has happened. Closing server.');
            process.exit(0);
        }
    });

export const Database = {
    this: database,
	"ready": async function() {
		Log.success(`* Database has been loaded.`);
	}
}




