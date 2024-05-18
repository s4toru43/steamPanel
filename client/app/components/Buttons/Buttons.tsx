'use client'

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from 'axios';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const Buttons = (props:any) => {
    const fileInputRef: any = useRef(null);

    const [count, setCount] = useState(0)

    const handleUpload = async (event: any) => {

        let file = event.target.files[0];

        if (!file) {
            alert('Выберите файл');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            await axios.post('/api/v1/uploadAccounts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Файл успешно загружен');
            fileInputRef.current.value = null;

        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            alert('Произошла ошибка при загрузке файла');
        }
    };


    const handleSubmit = (e: any) => {
        e.preventDefault();
        let length = count;
       let accs = props.accounts.filter((item:any) => {
            if(!props.selectedAccounts.includes(item.id) && length > 0) {
                length--;
                return item;
            }
        })
        props.setSelectedAccounts((prev:any) => [...prev, ...accs.map((item:any) => item.id)])
    }

    const handleRun = () => {
            const data = props.accounts.filter((item:any) => props.selectedAccounts.includes(item.id))
            const run = axios.post('/api/v1/runCSAccounts', data)
            .then((res) => console.log(res))
            return;
    }

    return (
        <div className="buttons">
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                className='buttons__form'
                onSubmit={handleSubmit}
            >
                <TextField id="outlined-basic" label="Count" variant="outlined" onChange={(e:any) => setCount(e.target.value)} value={count}/>
                <Button variant="contained" type='submit'>Select</Button>
            </Box>
            <Button variant="contained" onClick={handleRun}>Run</Button>
            <Button variant="contained">Close All</Button>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                className='buttons__upload'
            >
                Upload accounts
                <VisuallyHiddenInput type="file" ref={fileInputRef} onChange={(event) => handleUpload(event)} />
            </Button>
        </div>
    );
}