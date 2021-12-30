const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const path = require('path');
const { mongoose } = require('./config/database');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use(cors({origin: 'http://localhost:4200'}));
//app.use(cors({origin: 'http://pijama.com'}));

//Routes
app.use('/api/auth/', require('./routes/auth.routes'));
app.use('/api/usuario/', require('./routes/usuario.routes'));
app.use('/api/producto/', require('./routes/producto.routes'));
app.use('/api/pedido/', require('./routes/pedido.routes'));
app.use('/api/sublimado/', require('./routes/sublimado.routes'));

//app.use('/public', express.static('public'));
app.use('/api/public', express.static('public'));


//Starting server
app.listen(app.get('port'), () => {
    //dotenv.lo();
    console.log("Server on port", app.get('port'));
});