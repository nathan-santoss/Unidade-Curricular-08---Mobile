import criarLoginAdmin from "../database/createAdmin.js"
let admin = undefined

export default function trueAdmin(login) {
    if (admin === undefined){
        admin = criarLoginAdmin()
    }
    if(admin.email === login.email && admin.senha === login.senha){
        return true
    }

    return false
}