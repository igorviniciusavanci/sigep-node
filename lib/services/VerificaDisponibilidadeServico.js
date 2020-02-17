/**
 * @author Waldson Vital dos Santos
 */
const soap = require('soap')
const config = require('../../config.json')[process.env.NODE_ENV]


const responseDisponibilidade = ( response ) => {
    let regError = /(^(.*?)\#)/g
    let obj = {
        status: false,
        message: response? response.replace(regError, '') : "A resposta do Correios não está no formato esperado.",
        cod: response? (regError.exec(response)[0]).replace('#', '') : '9999'
    }

    if(['0', '010', '011'].includes( obj.cod )){
        obj.status = true
    }

    return obj
}

module.exports = async ( data ) => {
    let params = {
        codAdministrativo: data.codAdministrativo,
        numeroServico: data.numeroServico,
        cepOrigem: data.cepOrigem,
        cepDestino: data.cepDestino,
        usuario: data.usuario,
        senha: data.senha
    }
    let functions = await soap.createClientAsync(config.url)
    let result = await functions.verificaDisponibilidadeServicoAsync( params )

    if( Array.isArray( result ) ){
        result = result[0]
    }

    return responseDisponibilidade( result.return? result.return : null )

}