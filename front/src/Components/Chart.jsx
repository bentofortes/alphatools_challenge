import React, {
  useEffect,
  useState
} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Box from '@mui/material/Box';

export default function Chart({ name, tunnel, data, historic }) {
  const [formatted, setFormatted] = useState([]);
  const [domain, setDomain] = useState([0, 0]);

  useEffect(() => {
    let aux = data.map(i => {
      if (i.fields.asset_name.toUpperCase() === name.toUpperCase()) {
        let newEntry = {};
        let time = new Date(i.fields.created_at_dt);
        newEntry["time"] = time.toLocaleTimeString("pt-br", {hour12: false}).slice(0, 8);
        newEntry["timeInt"] = time;
        newEntry["price"] = i.fields.price;
    
        return newEntry;
      }
    }).filter(i => i !== undefined);

    aux.sort((a, b) => a.timeInt - b.timeInt);

    setFormatted(prevFormatted => {
      if (!historic && prevFormatted.length >= 6) {
        return ([...prevFormatted.slice(1, 6), ...aux]);
      }
      return [...prevFormatted, ...aux];
    });
  }, [data]);

  useEffect(() => {
    setDomain([
      Math.max(...formatted.map(i => i.price)),
      Math.min(...formatted.map(i => i.price))
    ]);
  }, [formatted]);

  if (data.length === 0) {return null;}

  // console.log(search, searchConfig, name, name === searchConfig[0].asset_name);

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      border: 1,
      borderRadius: 1,
      marginBottom: "16px",
      minWidth: historic? "1000px" : "500px",
      maxWidth: "1500px",
      // width: "100%",
      height: "210px"
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        margin: "16px",
        minWidth: "200px",
        justifyContent: "space-evenly"
      }}>
        <Box sx={{marginY: "10px"}}>Nome do Ativo: {name.toUpperCase()}</Box>

        <Box sx={{marginY: "10px"}}>
          Último preço: {formatted.length > 0 ? formatted[formatted.length - 1]["price"] : null} R$
        </Box>

        {historic? null : <Box sx={{marginY: "10px"}}>Preço mínimo: {tunnel[0]}</Box>}
        
        {historic? null : <Box sx={{marginY: "10px"}}>Preço máximo: {tunnel[1]}</Box>}

      </Box>

      <Box sx={{overflowX: "scroll", overflowY: "visible"}}>
      <LineChart
        width={historic? 100 * formatted.length : 600}
        height={180}
        data={formatted}
        margin={{
          top: 30,
          right: 50,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={domain} />
        <Tooltip />
        <Line type="monotone" dataKey="price" strokeWidth="3" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      </Box>
      
    </Box>
  );
}
  