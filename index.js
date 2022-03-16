const express = require( 'express' );
const mongoose = require( 'mongoose' );
const cors = require( 'cors' );
const authRoutes = require( './routes/auth' )
const dashBoardRoutes = require( './routes/dashboard' );
const veryfyToken = require( './routes/validate-token' );



const port = 3001;
const app = express();
app.use(cors())

//request-config
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

//db-connection
const uri = 'mongodb://localhost:27017/users';
mongoose.connect( uri, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then( () => console.log( 'database is running!!' ) )
    .catch( e => console.log('error db:', e))

//routes
app.use( '/api/user', authRoutes )
app.use('/api/dashboard', veryfyToken, dashBoardRoutes)
//starting the server
app.listen( port, () => {
    console.log('server running')
})