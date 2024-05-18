import express from 'express';
import cors from "cors";
import { getAbsoluteFilePath, getCSAccounts, uploadCSAccounts, runCSAccounts } from './actions.js';
import multer from 'multer';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const loginUsersPath = getAbsoluteFilePath('config/loginusers.vdf');
const upload = multer({ dest: 'uploads/' }); // Папка для сохранения файлов




app.post('/api/v1/runCSAccounts', (req, res) => {
    runCSAccounts(req.body, 60000, loginUsersPath, res);
})
app.post('/api/v1/uploadCSAccounts', upload.single('file'),(req, res) => {
    uploadCSAccounts(req, res);
})
app.get('/api/v1/getCSAccounts', (req, res) => {
    getCSAccounts(res);
})



// app.post('/api/v1/runsteam', (req, res) => {
//     runOneUser(req.body, loginUsersPath, command, res);
// });
// app.post('/api/v1/runfive', (req, res) => {
//     runFiveUsers(req.body.chunk, 0, loginUsersPath, steamPath, res);
// });
// app.post('/api/v1/closeall', (req, res) => {
//     closeAllSteamProcesses(res);
// });











app.listen(5000, () => console.log('App listening on port 5000!'));