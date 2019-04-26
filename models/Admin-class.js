let db;

module.exports = (_db) => {
    db = _db;
    return Admin
};

let Admin = class {
    static get(email){
        return new Promise((next) =>{
            db.query("select * from admin where email = ?", [email])
                .then(result => next(result[0]))
                .catch(err => next(err))
        })
    }
}
