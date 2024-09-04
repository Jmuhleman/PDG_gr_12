import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import './logInOut.css';
import { APIGetRequest } from '../../utils/APIRequest';
import { urlAPI } from '../../config';

const LogInOut = () => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState({code: 0, text: ''});

    const [logUnformatted, setLogUnformatted] = useState([]);
    const [log, setLog] = useState([]);
    const [sort, setSort] = useState('desc');
    const [search, setSearch] = useState("");

    useEffect(() => {
        APIGetRequest({url: `${urlAPI}/parking`, setData: setData, setStatus: setStatus});
    }, []);
    
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
    }, [data]);

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
    }, [search, logUnformatted]);

    return (<>
        <h1>Log </h1>
        <p style={{color: 'red'}}>{(status.code<200 || status.code >=300) && status.text}</p>
        {log.length !== 0 && <input type="text" onChange={(e)=>{setSearch(e.target.value)}} value={search} placeholder="Rechercher" />}
        {log.length !== 0 && <table>
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
        </table>}
        <button className='btn white-btn' onClick={() => window.history.back()}>Retour</button>
    </>);
};

export default LogInOut;