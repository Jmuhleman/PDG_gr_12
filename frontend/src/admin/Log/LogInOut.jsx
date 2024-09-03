import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import './logInOut.css';

const LogInOut = () => {
    const [data, setData] = useState([
        {
            "id" : 2,
            "plate" : "GE654321",
            "parking_id" : 2,
            "timestamp_in" : "2024-08-26T08:00:00.000Z",
            "timestamp_out" : "2024-08-26T13:00:00.000Z"
        },
        {
            "id" : 3,
            "plate" : "GE654321",
            "parking_id" : 3,
            "timestamp_in" : "2024-08-27T09:00:00.000Z",
            "timestamp_out" : "2024-08-27T14:00:00.000Z"
        },
        {
            "id" : 4,
            "plate" : "GE14982",
            "parking_id" : 2,
            "timestamp_in" : "2024-08-24T10:00:00.000Z",
            "timestamp_out" : "2024-08-24T10:30:15.000Z"
        },
        {
            "id" : 5,
            "plate" : "AI89012",
            "parking_id" : 3,
            "timestamp_in" : "2024-08-27T11:00:00.000Z",
            "timestamp_out" : null
        },
        {
            "id" : 6,
            "plate" : "FR111222",
            "parking_id" : 1,
            "timestamp_in" : "2024-08-27T12:00:00.000Z",
            "timestamp_out" : null
        }
    ]);

    const [logUnformatted, setLogUnformatted] = useState([]);
    const [log, setLog] = useState([]);
    const [sort, setSort] = useState('desc');
    const [search, setSearch] = useState("");
    
    useEffect(() => {
        const UnformattedLog = data.flatMap(({plate, timestamp_in, timestamp_out}) => {
            const formattedTimestampIn = DateTime.fromJSDate(new Date(timestamp_in)).setLocale('ch').toFormat('dd LLL yyyy hh:mm');
            const formattedTimestampOut = timestamp_out ? DateTime.fromJSDate(new Date(timestamp_out)).setLocale('ch').toFormat('dd LLL yyyy hh:mm') : null;
            
            return [
                {
                    plate: plate,
                    timestamp: formattedTimestampIn,
                    status: "IN"
                },
                {
                    plate: plate,
                    timestamp: formattedTimestampOut,
                    status: "OUT"
                }
            ];
        }).filter(({timestamp}) => timestamp !== null);
        setLogUnformatted(UnformattedLog);
    }, []);

    useEffect(() => {
        setLog(logUnformatted.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1));
    }, [logUnformatted]);

    const changeFilter = () => {
        setSort(sort === 'asc' ? 'desc' : 'asc')
        if(sort === 'asc') {
            setLog(log.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1));
        } else {
            setLog(log.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1));
        }
    }

    useEffect(() => {
        setLog(logUnformatted.filter(({plate}) => plate.includes(search)));
        console.log(log);
    }, [search]);

    return (<>
        <h1>Log </h1>
        <input type="text" onChange={(e)=>{setSearch(e.target.value)}} value={search} placeholder="Rechercher" />
        <table>
            <thead>
                <tr>
                    <th>Plaque</th>
                    <th onClick={changeFilter} className='flex-row'>Date et Heures <p className={sort}>▲</p></th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {log && log.map((item, id) => (
                    <tr key={id+item.status} className={item.status + " trData"}>
                        <td>{item.plate}</td>
                        <td>{item.timestamp}</td>
                        <td>{item.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <button className='btn white-btn' onClick={() => window.history.back()}>Retour</button>
    </>);
};

export default LogInOut;