'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';


interface IUsers {
    id:string
    login:string
}

export default function Dashboard() {

    const [count, setCount] = useState<Number[]>([]);
    const [users, setUsers] = useState<IUsers[]>([]);

    function getUsers () {
       const fetch = axios.get('http://localhost:5000/api/v1/getAccounts')
        .then((response) => {
            setUsers(response.data)
          
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
     
        getUsers();

        return () => {
            getUsers();
        }

    }, [])

   
    const runUser = (id: string, login: string, index: number): any => {
        setCount((prev) => [...prev, index])
        const fetch = axios.post('http://localhost:5000/api/v1/runsteam', {
            id,
            login
        })
            .then((response) => {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });

        console.log('start one')

    }

    const runFive = () => {
        let chunk: Object[] = []
        let i = 0;
        users.forEach((item, index) => {
            if (!count.includes(index) && i < 5) {
                setCount((prev) => [...prev, index])
                chunk.push(item)
                i++
            }
        })

        const fetch = axios.post('http://localhost:5000/api/v1/runfive', {
            chunk
        })
            .then((response) => {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });

        console.log('start five')
    }
    const closeAll = () => {
        setCount([])
        const fetch = axios.post('http://localhost:5000/api/v1/closeall')
            .then((response) => {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error);
            });

        console.log('close ALL')
    }

    

    return (
        <>
            <h1 className='users__title'>List of accounts</h1>
            <div className="users">
                <div className="users__other">
                    <button className="users__btn" onClick={() => runFive()}>Run five</button>
                    <button className="users__btn" onClick={() => closeAll()}>Close ALL</button>
                    <div className="number__accs">
                        <p>Number of accounts: <span>{users.length}</span></p>
                    </div>
                </div>
                <table className="users__list">
                    <tbody>
                        <tr className='users__list-title'>
                            <th>ID</th>
                            <th>LOGIN</th>
                            <th>BUTTON</th>
                        </tr>
                        {users.map((item, index) => (
                            <tr key={index} className={count.includes(index) && count.slice(-5).includes(index) ? 'user active' : count.includes(index) && !count.slice(-5).includes(index) ? 'user used' : 'user'}>
                                <td>{item.id}</td>
                                <td>{item.login}</td>
                                <td><button className="users__btn" onClick={() => runUser(item.id, item.login, index)}>Play</button></td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </>
    );
}
