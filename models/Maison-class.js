let db;

module.exports = (_db) => {
    db = _db;
    return Maison
};

let Maison = class {
    static addMaison(nom,type,style,longueur,largeur,chambre,douche,prix,estimation,description){
        return new Promise((next)=>{
            db.query('insert into maison(nom, type, style_id, longueur, largeur, chambre, douche, prix, estimation, description, date_crea) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())', [nom,type,style,longueur,largeur,chambre,douche,prix,estimation,description])
                .then(() => {
                    return db.query("select max(id) as id from maison")
                })
                .then(result => next(result[0].id))
                .catch(err =>next(err))
        })
    }

    static getMaison(id){
        return new Promise((next)=>{
            db.query('select m.*, s.libele as style_c, m.longueur*m.largeur as superficie, DATE_FORMAT(m.date_crea, "%D %b %Y") as form from maison m, style s where m.id=? and s.id=m.style_id', [id])
                .then(result => next(result[0]))
                .catch(err =>next(err))
        })
    }

    static addImg(maison_id, img){
        return new Promise((next)=>{
            db.query('insert into modele(maison_id, img, type) VALUES(?, ?, 1)', [maison_id, img])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }
    
    static getImg(id){
        return new Promise((next)=>{
            db.query('select img from modele where type=1 and maison_id=?', [id])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }

    static addPlan(maison_id, img){
        return new Promise((next)=>{
            db.query('insert into modele(maison_id, img, type) VALUES(?, ?, 0)', [maison_id, img])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }
    
    static getPlan(id){
        return new Promise((next)=>{
            db.query('select img from modele where type=0 and maison_id=?', [id])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }

    static getAllMaison(){
        return new Promise((next)=>{
            db.query('select m.*, s.libele as style_c, m.longueur*m.largeur as superficie, (select a.img from modele a where a.maison_id = m.id and a.type=1 limit 1) as img from maison m, style s where m.style_id = s.id order by m.date_crea desc')
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }

    static getMaisonByUser(user_id){
        return new Promise((next)=>{
            db.query('select DISTINCT  m.*, m.longueur*m.largeur as superficie from maison m, achat a where m.id = any (select a.maison_id from achat a where a.user_id=?) order by m.date_crea desc', [user_id])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }

    static verifAchat(user_id, maison_id){
        return new Promise((next)=>{
            db.query('select * from achat where  user_id=? and maison_id=?', [user_id , maison_id])
                .then((result) => {
                    if(result.length > 0)
                        next(true)
                    else
                        next(false)
                })
                .catch(err =>next(err))
        })
    }

    static addAchat(user_id, maison_id){
        return new Promise((next)=>{
            db.query('insert into achat(maison_id, user_id, date_achat) VALUES(?,?,now())',[maison_id, user_id])
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }
    
    static getAllStyle(){
        return new Promise((next)=>{
            db.query('select * from style')
                .then(result => next(result))
                .catch(err =>next(err))
        })
    }

    static getAnnual(){
        return new Promise((next)=>{
            db.query('select sum(m.prix) as annual_gain, count(*) as annual_sell from achat a, maison m where a.maison_id = m.id and year(a.date_achat)=year(now())')
                .then(result => next(result[0]))
                .catch(err =>next(err))
        })
    }

    static getMensual(){
        return new Promise((next)=>{
            db.query('select sum(m.prix) as mensual_gain, count(*) as mensual_sell from achat a, maison m where a.maison_id = m.id and month(a.date_achat)=month(now())')
                .then(result => next(result[0]))
                .catch(err =>next(err))
        })
    }
}