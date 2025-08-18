import pg from 'pg';
import env from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

env.config({ path: envPath });

const db = new pg.Client({
    user:   process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
});


db.connect()
    .then(() => console.log("connect to database successfully"))
    .catch((error) => console.log("Failed to connect to database " + error.stack));
export default db