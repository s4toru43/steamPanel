import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import multer from 'multer';

// Функция для замены содержимого файла
export async function replaceFileContent(file, newContent) {

  try {
    await fs.writeFile(file, newContent, (data) => {
      console.log('Содержимое файла успешно заменено');
      return data;
    });

  } catch (err) {
    console.error('Ошибка при записи в файл:', err);
  }
}

// Получение абсолютного пути к файлу
export function getAbsoluteFilePath(filename) {
  return path.resolve('C:/Program Files (x86)/Steam/', filename);
}

//Function for close all process
export function closeAllSteamProcesses() {

  exec(`powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "Start-Process powershell -Verb runAs -ArgumentList '-NoExit','-Command "taskkill /F /IM steam.exe; exit"'`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Ошибка: ${stderr}`);
      return;
    }
    console.log(`Стандартный вывод: ${stdout}`);
  });
};

export const uploadCSAccounts = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Перемещаем загруженный файл из временной директории в нужное место
    await fs.promises.rename(file.path, `uploads/${file.originalname}`);
    console.log('Файл успешно сохранен:', file.originalname);
    res.status(200).send('File uploaded successfully.');
  } catch (err) {
    console.error('Ошибка при перемещении файла:', err);
    res.status(500).send('Internal server error');
  }
};

const readData = async () => {
  try {
    const data = await fs.promises.readFile(path.resolve('uploads/cs2.json'), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    return [];
  }
};
//Function for get all accounts from config
export async function getCSAccounts(res) {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    res.status(500).send('Internal server error');
  }
};


//Function for startup steam windows
export async function runCSAccounts(data, delay, file, res) {
  res.status(200).send('Sucess')
  try {

    let x = 0;
    let y = 0;

    for (let i = 0; i < data.length; i++) {
      const usersData = `"users"
      {
        "${data[i].id}"
        {
          "AccountName"		"${data[i].login}"
          "PersonaName"		"${data[i].name}"
          "RememberPassword"		"1"
          "WantsOfflineMode"		"0"
          "SkipOfflineModeWarning"		"0"
          "AllowAutoLogin"		"0"
          "MostRecent"		"0"
          "Timestamp"		"1713210089"
        } 
      }`;
  
  
      replaceFileContent(file, usersData)

      console.log(`Запуск экземпляра Steam ${i + 1}`);
      const command = `start "" "${getAbsoluteFilePath('steam.exe')}" -vgui -noreactlogin -language russian -no-browser -applaunch 730 -console -low -nohltv -nosound -novid -window -w 400 -h 300  +exec autoexec.cfg -x ${x} -y ${y}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка при выполнении: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Ошибка: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
      // Дождитесь 5 секунд перед запуском следующего экземпляра
      await new Promise(resolve => setTimeout(resolve, delay));
      x += 400;
    }
  
  } catch (error) {
    throw error;
  }
};

// //Function for find all accounts from config
// export function parseConfigVDF(content) {
//   try {
//     const accounts = {};

//     const accountRegex = /"([^"]+)"\s*{\s*"SteamID"\s*"(\d+)"\s*}/g;
//     let match;

//     while ((match = accountRegex.exec(content)) !== null) {
//       const login = match[1];
//       const steamID = match[2];
//       accounts[login] = steamID;
//     }

//     return accounts;
//   } catch (error) {
//     throw error;
//   }
// };




// //Function for startup only one steam
// export function runOneUser(data, file, command, res) {
//   const usersData = `"users"
//   {
//     "${data.id}"
//     {
//       "AccountName"		"${data.login}"
//       "PersonaName"		"${data.login}"
//       "RememberPassword"		"1"
//       "WantsOfflineMode"		"0"
//       "SkipOfflineModeWarning"		"0"
//       "AllowAutoLogin"		"0"
//       "MostRecent"		"0"
//       "Timestamp"		"1715062253"
//     }
//   }
//   `;

//   try {

//     replaceFileContent(file, usersData);
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Ошибка при выполнении: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`Ошибка: ${stderr}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//     });
//     return res.status(200);
//   } catch (error) {
//     throw error;
//   }
// };
