'use client'

import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GRID_CHECKBOX_SELECTION_COL_DEF} from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'number', headerName: '№', width: 70, renderCell: (params) => params.api.getSortedRowIds().indexOf(params.id) + 1 },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'login', headerName: ' LOGIN', width: 130 },
    { field: 'status', headerName: 'STATUS', width: 130, renderCell: () => 'offline' },
    {
        ...GRID_CHECKBOX_SELECTION_COL_DEF
    },
];

export const Accounts = (props: any) => {
    
    const [selectedAccounts, setSelectedAccounts] = useState<[]>([]);

    useEffect(() => {

        async function getSelectedAccounts() {
            await setSelectedAccounts(props.selectedAccounts)
        }

        getSelectedAccounts();


        return () => {

        }
    }, [props.selectedAccounts])



    const handleChange = (e: any, d: any): void => {
        props.setSelectedAccounts(e)
    };

    return (
        <div className='accounts'>
            <div style={{ height: '90vh', width: '100%', color: 'white' }}>
                <DataGrid
                    rows={props.accounts}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    rowSelectionModel={selectedAccounts}
                    checkboxSelection
                    // loading
                    onRowSelectionModelChange={(e: any, d: any) => handleChange(e, d)}
                />
            </div>


        </div>

    );
}