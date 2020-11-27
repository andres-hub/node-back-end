const {Schema, model} = require('mongoose');

const EntidadSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    moduloId: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        required: true
    },
    url:{
        type: String,
        required: true
    },
    acciones:[{
        type: String,
        required: true
    }],
}, {collection: 'entidades'});

EntidadSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Entidad', EntidadSchema);