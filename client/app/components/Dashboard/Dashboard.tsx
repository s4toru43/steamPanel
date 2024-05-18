'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Accounts } from '../Accounts/Accounts';
import { Buttons } from '../Buttons/Buttons';
import { ThemeProvider, createTheme } from '@mui/material/styles';



export default function Dashboard() {
    const [accounts, setAccounts] = useState<Object[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<Number[]>([]);

    useEffect(() => {

        async function getAccounts() {
            const response = await axios.get('/api/v1/getCSAccounts')
                .then((resp: any) => setAccounts(resp.data))
        }
      
        getAccounts();


        return () => {

        }
    }, [])
    
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <div className="panel">
                    <Accounts accounts={accounts} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts}/>
                    <Buttons accounts={accounts} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts}/>
                </div>
            </ThemeProvider>
        </>
    );
}
