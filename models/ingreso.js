const {Schema, model} = require('mongoose');
const { stringify } = require('uuid');

const IngresoSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    frecuencia: {
        type: String,
        required: true
    },
    valor: {
        type: String,
        required: true
    },
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    }
});

IngresoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Ingreso', IngresoSchema);