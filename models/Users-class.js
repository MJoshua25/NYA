let db;

module.exports = (_db) => {
    db = _db;
    return Users
};

let Users = class {
    static getAll(){
        return new Promise((next)=>{
            db.query('select * from users')
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }
    static add(nom, phone, email, pass){
        return new Promise((next) => {
            db.query("insert into users(nom, phone, email, password, date_crea) values (?,?,?,?,now())", [nom, phone, email, pass])
            .then(() => {
                return db.query("select * from users where email = ?",[email])
            })
            .then(result => next(result[0]))
            .catch(err => next(err))
        })
    }
    static getByEmail(email){
        return new Promise((next) =>{
            db.query("select * from users where email = ?", [email])
                .then(result => next(result[0]))
                .catch(err => next(err))
        })
    }
    /*static update(nom, prenom, pseudo, email){
        return new Promise((next) => {
            db.query("update users set nom = ?, prenom = ?, pseudo = ? where email = ?", [nom, prenom, pseudo, email])
                .then(() => next(true))
                .catch(err =>next(err))
        })
    }*/

    static delete(email){
        return new Promise((next) =>{
            db.query("delete from users where email = ?",[email])
                .then(() => next(true))
                .catch(err =>next(err))
        })
    }
    
    static updatePassword(id, pass){
        return new Promise((next) =>{
            db.query("update users set password = ? where id = ?",[pass, id])
                .then(() => next(true))
                .catch(err =>next(err))
        })
    }
}