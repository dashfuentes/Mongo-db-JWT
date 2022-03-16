const router = require( 'express' ).Router();
const User = require( '../models/User' );
const jwt = require( 'jsonwebtoken' );
const config = require( 'dotenv' ).config();
const Joi = require( '@hapi/joi' );
const bcrypt = require( 'bcrypt' );


router.post( '/register',async  ( req, res ) => {
    
    // const isEmailExist = await User.findOne( { email: req.body.email } );

    // if ( isEmailExist ) {
    //     return res.status( 400 ).json( {
    //         error: "the email already exist!!"
    //     })
    // }

    //validations fields
    const schemaRegister = Joi.object( {
        user: Joi.string().min( 3 ).max( 255 ).required(),
        name: Joi.string().min( 3 ).max( 255 ).required(),
        email: Joi.string().min( 6 ).max( 255 ).email(),
        password: Joi.string().min( 8 ).max( 1025 ).required()

    } );

    const { error } = schemaRegister.validate( req.body );
    
    if ( error ) {
        return res.status( 400 ).json( {
            error : error.details
        })
    }

    //encrypt the password with bcrypt
    const salt = await bcrypt.genSalt( 5 );
    const password = await bcrypt.hash( req.body.password, salt );
    //
    const user = new User( {
        user: req.body.user,
        name: req.body.name,
        email: req.body.email,
        password: password,
    } );

    try {
        const savedUser = await user.save();
        res.json( {
            error: null,
            data: savedUser
        })
    } catch (error) {
        res.status(400).json({error})
    }
} )

router.post( '/login', async ( req, res ) => {
    
    //validations fields

    const user = await User.findOne( { email: req.body.email } );
    if ( !user ) return res.status( 400 ).json( { error: "user not found!!" } );

    //compare passwords with bcrypt
    const validatePwd = await bcrypt.compare( req.body.password, user.password );
    console.log(validatePwd)
    if (validatePwd ) return res.status( 400 ).json( { error: 'invalid password' } );

    
    const token = jwt.sign( {
        name: user.name,
        id: user._id,
        email: user.email
    }, process.env.TOKEN_SECRET, {expiresIn: "120s"} );

    res.header( 'auth-token', token ).json( {
        error: null,
        data: { token }
    } )
} );

module.exports = router;