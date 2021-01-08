const jwt = require('jsonwebtoken');

const generarJWT = (uid, role)=>{

    return new Promise ((resolve, reject)=>{

        const payload = {
            uid,
            role
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token)=>{
            if(err){
                reject('No se pudo generar el JWT');
            }
            resolve(token);
        });

    });
}

module.exports = {
    generarJWT
}