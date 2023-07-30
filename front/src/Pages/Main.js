import React from "react";
import {
  useState,
  useEffect
} from 'react';
import {
  Box,
  Button
} from '@mui/material';

import {
  get_prices,
  get_history
} from "../Helpers/ApiHelper";
import {
  Chart,
  Header
} from "../Components";


function Main() {
  const [freq, setFreq] = useState(10000);
  const [data, setData] = useState([]);
  const [historicData, setHistoricData] = useState([]);
  const [modeHistoric, setModeHistoric] = useState(false);
  const [search, setSearch] = useState([]);


  useEffect(() => {
    if (modeHistoric) {
      const fetchData = async () => {
        let response = await get_history();
        setHistoricData(response);

        let aux = [];
        for (let i = 0; i < response.length; i++) {
          if (!aux.includes(response[i].fields.asset_name.toUpperCase())) {
            aux.push(response[i].fields.asset_name.toUpperCase());
          }
        }

        aux = aux.map(i => {return {asset_name: i}})
        setSearch(aux);
      }
      fetchData();
    }
    else {
      setSearch([]);
      setData([]);
      setHistoricData([]);
    }
  }, [modeHistoric]);

  useEffect(() => {
    if (search.length !== 0 && !modeHistoric) {
      const interval = setInterval(() => {
        const fetchData = async () => {
          let response = await get_prices(search);
          setData(response);
        }
        fetchData();
      }, freq);

      return () => clearInterval(interval);
    }
  }, [search, freq, modeHistoric]);


  return (
    <Box
      sx={{
        margin: 3,
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#fdf5ff',
        alignItems: "center",
        // justifyContent: "center"
      }}
    >
      {modeHistoric? null :
        <Header
          setParentSearch={setSearch}
          setParentFreq={setFreq}
        />
      }

      {search.map(i =>
        <Chart
          key={i.asset_name}
          name={i.asset_name}
          tunnel={[i.min, i.max]}
          data={historicData.length > 0 ? historicData : data}
          historic={historicData.length > 0}
        />
      )}

      <Button
        variant="contained"
        onClick={() => setModeHistoric(prev => !prev)}
      >
        {modeHistoric? "Consultar tempo real" : "Consultar histórico"}
      </Button>

    </Box>
  );
}

export default Main;