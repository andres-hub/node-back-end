const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next)=>{

    const token = req.header('x-token');

    if(!token){
        // TODO: Guardar log
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }

    try {

        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        
        next();

    } catch (error) {
         // TODO: Guardar log
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }
    
}

module.exports = {
    validarJWT
}