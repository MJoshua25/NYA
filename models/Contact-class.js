let db;

module.exports = (_db) => {
    db = _db;
    return Contact
};

let Contact = class {
    static getAll(){
        return new Promise((next)=>{
            db.query('select u.nom, u.phone, u.email, m.nom as nom_maison, c.*  from contact c, users u, maison m where c.user_id=u.id and c.maison_id = m.id order by c.statut, date_contact desc')
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }
    static add(users_id, maison_id){
        return new Promise((next) => {
            db.query("insert into contact(user_id, maison_id, statut, date_contact) VALUES(?, ?, 0, now())", [users_id, maison_id])
                .then(result => next(result))
                .catch(err => next(err))
        })
    }
    static isContacted(user_id, maison_id){
        return new Promise((next) =>{
            db.query("select * from contact where user_id= ? and maison_id=?", [user_id, maison_id])
                .then((result) => {
                    if(result.length > 0){
                        next(true)
                    }

                    else
                        next(false)
                })
                .catch(err => next(err))
        })
    }
    
    static setView(id){
        return new Promise((next) => {
            db.query("update contact set statut=1 where id=?", [id])
                .then(result => next(result))
                .catch(err => next(err))
        })
    }

    static getContact(){
        return new Promise((next) => {
            db.query("select count(user_id) as mensual_contact from contact where month(date_contact) = month(now())")
                .then(result => next(result[0].mensual_contact))
                .catch(err => next(err))
        })
    }

    static getBinding(){
        return new Promise((next) => {
            db.query("select count(*) as binding_contact from contact where statut=0")
                .then(result => next(result[0].binding_contact))
                .catch(err => next(err))
        })
    }
}