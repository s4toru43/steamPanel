import express from 'express';
import cors from "cors";
import { getAbsoluteFilePath, getAccounts, runOneUser, closeAllSteamProcesses, runFiveUsers } from './actions.js';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const loginUsersPath = getAbsoluteFilePath('config/loginusers.vdf');
const configPath = getAbsoluteFilePath('config/config.vdf');
const steamPath = getAbsoluteFilePath('steam.exe');
const command = `start "" "${steamPath}" -vgui -noreactlogin -language russian -no-browser -applaunch 730 -console -low -nohltv -nosound -novid -window -w 400 -h 300  +exec autoexec.cfg -x 0 -y 0`;



app.post('/api/v1/runsteam', (req, res) => {
    runOneUser(req.body, loginUsersPath, command, res);
});
app.post('/api/v1/runfive', (req, res) => {
    runFiveUsers(req.body.chunk, 10000, loginUsersPath, command, res);
});
app.post('/api/v1/closeall', (req, res) => {
    closeAllSteamProcesses(res);
});
app.get('/api/v1/getAccounts', (req, res) => {
    getAccounts(configPath, res);
})



app.listen(5000, () => console.log('App listening on port 5000!'));