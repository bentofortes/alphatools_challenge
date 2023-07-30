import React from "react";
import {
  useState,
  useEffect
} from 'react';
import {
  Box,
  TextField,
  Button
} from '@mui/material';


export default function Header({ setParentSearch, setParentFreq }) {
  const [name, setName] = useState("");
  const [freq, setFreq] = useState(10000);
  const [tunnel, setTunnel] = useState([0, 0]);


  const handleClick = () => {
    if (name !== "" && tunnel[0] !== 0 && tunnel[1] !== 0) {
      setParentSearch(prev => {
        return [...prev, {
          asset_name: name,
          max: tunnel[1],
          min: tunnel[0],
        }];
      });
    }
  }

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={ e => {
        e.preventDefault();
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "8px",
        fontSize: "20px"
      }}
    >
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "40px"
      }}>

      Intervalo de atualização dos preços em segundos:
      <TextField
        variant="outlined"
        placeholder="10"
        onChange={ e => setFreq(Number(e.target.value) * 1000) }
        sx={{
          width: "8ch",
          marginLeft: "10px",
          marginRight: "40px"
        }}
      />

      <Button
        variant="contained"
        onClick={() => setParentFreq(freq)}
      >
        Atualizar intervalo
      </Button>

      </Box>

      <Box sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: "40px",
        minWidth: "1200px"
      }}>

        <TextField
          variant="outlined"
          placeholder="Nome de um novo ativo"
          onChange={ e => setName(e.target.value) }
        />

        <TextField
          variant="outlined"
          placeholder="Preço máximo"
          onChange={e => setTunnel(prev => [prev[0], Number(e.target.value)])}
        />

        <TextField
          variant="outlined"
          placeholder="Preço mínimo"
          onChange={e => setTunnel(prev => [Number(e.target.value), prev[1]])}
        />

      <Button
        variant="contained"
        onClick={handleClick}
      >
        Pesquisar
      </Button>

      </Box>
      

      
    </Box>
  );
}