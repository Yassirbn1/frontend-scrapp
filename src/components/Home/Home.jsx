import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScrappDataList from './ScrappDataList';

const Home = () => {
    const [scrappData, setScrappData] = useState({
        id: 0,
        quantitéRetour: '',
        quantitéRestantePr: '',
        quantitéEntréePr: ''
    });

    useEffect(() => {
        fetchTodayScrappData();
    }, []);

    const fetchTodayScrappData = async () => {
        try {
            const response = await axios.get('http://localhost:5062/api/ScrappData/Today');
            const data = response.data;

            if (data) {
                setScrappData({
                    id: data.id,
                    quantitéRetour: data.quantitéRetour || '',
                    quantitéRestantePr: data.quantitéRestantePr || '',
                    quantitéEntréePr: data.quantitéEntréePr || ''
                });
            } else {
                setScrappData({
                    id: 0,
                    quantitéRetour: '',
                    quantitéRestantePr: '',
                    quantitéEntréePr: ''
                });
            }

        } catch (error) {
            console.error('Failed to fetch ScrappData:', error);
        }
    };

    return (
        <div>
            <h2>Home</h2>
            <ScrappDataList scrappData={scrappData} fetchTodayScrappData={fetchTodayScrappData} />
        </div>
    );
};

export default Home;
