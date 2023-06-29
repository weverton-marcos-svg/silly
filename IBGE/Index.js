/* 
    Construção com CHATGPT
    
    SUMARIO IBGE:https://servicodados.ibge.gov.br/api/docs/localidades#api-_
*/

const express = require('express');
const axios = require('axios');
const convert = require('xml-js');

const app = express();

app.get('/:endpoint/:filter?/:format?', async (req, res) => {
  try {
    const { endpoint, filter, format } = req.params;

    let apiUrl = '';

    switch (endpoint) {
      case 'estados':
        apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
        break;
      case 'estado-id':
        apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filter || ''}`;
        break;
      case 'regioes':
        apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/regioes';
        break;
      case 'municipios':
        apiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
        break;
      case 'cep':
        apiUrl = `https://viacep.com.br/ws/${filter || ''}/json/`;
        break;
      case 'municipios-estado':
        apiUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filter || ''}/municipios`;
        break;
      default:
        return res.status(400).send('Endpoint inválido');
    }

    const response = await axios.get(apiUrl);
    const jsonData = response.data;

    if (format && format.toLowerCase() === 'xml') {
      const xmlData = convert.js2xml(jsonData, { compact: true, spaces: 4 });
      res.set('Content-Type', 'application/xml');
      res.send(xmlData);
    } else {
      res.json(jsonData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error');
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
