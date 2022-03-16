const router = require( 'express' ).Router();

router.post( '/', ( req, res ) => {
    res.json( {
        error: null,
        data: {
            title: 'this route is under several security  layers 🔒 ',
            user: req.user
        }
    } )
} );

module.exports = router;