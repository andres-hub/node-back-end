const {response} = require('express');
const jwt = require('jsonwebtoken');
const { guardarLog } = require('../helpers/guardar-Log');

const validarJWT = (req, res = response, next)=>{
    
    const token = req.header('x-token');

    if(!token){
        const msg = 'Token invalido';
        const status = 401;
        guardarLog(req,token, msg, status);
        return res.status(status).json({
            ok: false,
            msg
        });
    }

    try {

        const {uid, role} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        req.role = role;
        
        next();

    } catch (error) {
        const msg = 'Token invalido';
        const status = 401;
        guardarLog(req, token, msg, status)
        return res.status(status).json({
            ok: false,
            msg
        });
    }
    
}

module.exports = {
    validarJWT
}