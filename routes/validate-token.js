const jwt = require( 'jsonwebtoken' );

//middleware to validate the token
const veryfyToken = ( req, res, next ) => {
    
    const token = req.header( 'auth-token' );
    if ( !token ) return res.status( 401 ).json( { error: 'Access Denied' } );

    try {
        console.log('trying...')
        const verified = jwt.verify( token, process.env.TOKEN_SECRET );
        console.log(verified)

        req.user = verified;
        next();

        //sending the post to /dashboard


    } catch (error) {
        res.status(400).json({error : 'token  no es valido'})
    }
}

module.exports = veryfyToken;

