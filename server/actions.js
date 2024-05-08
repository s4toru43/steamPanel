import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

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

  function getPID(processName) {
    return new Promise((resolve, reject) => {
        exec(`powershell "Get-Process ${processName} | Select-Object -ExpandProperty Id"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            const lines = stdout.trim().split('\n').filter(line => line.trim() !== '');
            const pids = lines.map(line => parseInt(line.trim()));
            if (pids.length > 0) {
                resolve(pids);
            } else {
                reject('Process not found');
            }
        });
    });
}

// Function to terminate a process by its PID
function killProcess(pid) {
    return new Promise((resolve, reject) => {
        exec(`taskkill /pid ${pid} /f`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

// Usage
const processName = 'steam'; // Replace with the process name you want to find and kill
getPID(processName)
    .then(pids => {
        console.log(`Found ${pids.length} instances of ${processName}`);
        return Promise.all(pids.map(pid => killProcess(pid)));
    })
    .then(() => {
        console.log(`All instances of ${processName} terminated.`);
    })
    .catch(error => {
        console.error(error);
    });
};


//Function for startup steam windows
export async function runFiveUsers(data, delay, file, command, res) {
  try {
    const usersArray = [];

    data.forEach(item => {
      usersArray.push(`"${item.id}"
        {
            "AccountName"		"${item.login}"
            "PersonaName"		"${item.login}"
            "RememberPassword"		"1"
            "WantsOfflineMode"		"0"
            "SkipOfflineModeWarning"		"0"
            "AllowAutoLogin"		"0"
            "MostRecent"		"0"
            "Timestamp"		"1715062253"
        }`)
    })

    const usersData = `"users"
    {
     ${usersArray.join('')}
    }
    `;

    replaceFileContent(file, usersData);
    let x = 0;
    let y = 0;

    for (let i = 0; i < 5; i++) {
      console.log(`Запуск экземпляра Steam ${i + 1}`);
      const command = `start "" "${steamPath}" -vgui -noreactlogin -language russian -no-browser -applaunch 730 -console -low -nohltv -nosound -novid -window -w 400 -h 300  +exec autoexec.cfg -x ${x} -y ${y}`;
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

//Function for find all accounts from config
export function parseConfigVDF(content) {
  try {
    const accounts = {};

    const accountRegex = /"([^"]+)"\s*{\s*"SteamID"\s*"(\d+)"\s*}/g;
    let match;

    while ((match = accountRegex.exec(content)) !== null) {
      const login = match[1];
      const steamID = match[2];
      accounts[login] = steamID;
    }

    return accounts;
  } catch (error) {
    throw error;
  }
};


//Function for get all accounts from config
export function getAccounts(file, res) {
  try {
    let users = [];

    fs.readFile(file, 'utf-8', (err, data) => {
      if (err) {
        console.error('Ошибка чтения файла:', err);
        return;
      }

      // Получаем аккаунты из содержимого файла config.vdf
      const accounts = parseConfigVDF(data);

      for (const [login, steamID] of Object.entries(accounts)) {
        users.push({ id: steamID, login })
      }
      res.send(users)
    });
  } catch (error) {
    console.error('Ошибка обработки файла:', error);
  }

};


//Function for startup only one steam
export function runOneUser(data, file, command, res) {
  const usersData = `"users"
  {
    "${data.id}"
    {
      "AccountName"		"${data.login}"
      "PersonaName"		"${data.login}"
      "RememberPassword"		"1"
      "WantsOfflineMode"		"0"
      "SkipOfflineModeWarning"		"0"
      "AllowAutoLogin"		"0"
      "MostRecent"		"0"
      "Timestamp"		"1715062253"
    }
  }
  `;

  try {

    replaceFileContent(file, usersData);
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
    return res.status(200);
  } catch (error) {
    throw error;
  }
};
