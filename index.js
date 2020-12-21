require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');

const app = express();

app.use(cors());

app.use(express.json());

dbConnection();

// Directorio publico
app.use(express.static('public'));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/modulos', require('./routes/modulos'));
app.use('/api/entidades', require('./routes/entidades'));
app.use('/api/parametros', require('./routes/parametros'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, ()=>{
    console.log("servidor corriendo en puerto "+ process.env.PORT);
});

