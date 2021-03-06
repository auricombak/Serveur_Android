var mongoose = require('mongoose');

// User Schema
var ReseauSocialSchema = mongoose.Schema({
    nom: {
        type: String,
        index:true
    },
    description: {
        type: String
	},
    messages: [{
        auteur : {
            type: String 
        },
        titre : {
            type: String 
        },
        corp : {
            type:String 
        }, 
        published:{
            type: Date,
            default:Date.now
        } 
    }],
    preferences : [String],
    published:{
        type: Date,
        default:Date.now
    },
    public:{
        type: Boolean
    },
    abonnes :[{type: mongoose.Schema.ObjectId, ref: 'UserApp'}],
    admin :{type: mongoose.Schema.ObjectId, ref: 'UserApp'}
});

var ReseauSocial = module.exports = mongoose.model('ReseauSocial', ReseauSocialSchema);

//Create ReseauSocial 
module.exports.createReseauSocial = function(newReseau, callback){
	newReseau.save(callback);
}

//Check if user is abonne 
module.exports.isAbonne = function(idR, idU, callback){
    var res = false;
    ReseauSocial.findById(idR)
    .exec(function(err, reseau){
        if (err) throw err;
        if(reseau.abonnes != null){
            var users = reseau.abonnes;
            for(var i = 0; i<users.length; i++){
                if(users[i].equals(idU) ){
                    res = true;
                }
            }
            
        }
        callback(err, res);
    });
}

//Affiche tout abonnes compris, d'un réseau 
module.exports.afficheTout = function(idR, callback){
    ReseauSocial.findById(idR)
    .populate('abonnes')
    .exec(callback);
}

//Check if an user is admin
module.exports.isAdmin = function(idR, idU, callback){
    ReseauSocial.findById(idR)
    .exec(function(err, reseau){
        if(err) return err;
        if( reseau.admin.equals(idU)){
            callback(err, true);
        }else{
            callback(err, false);
        }
    });
}

//Get ReseauSocial by nom
module.exports.getReseauSocialByName = function(name, callback){
	var query = {nom: name};
	ReseauSocial.findOne(query, callback);
}


//Get ReseauSocial by id
module.exports.getReseauSocialById = function(id, callback){
	ReseauSocial.findById(id, callback);
}

//Get ReseauSociaux
module.exports.getReseauxSociaux= function(limit, callback){
    ReseauSocial.find()
    .limit(limit)
    .exec(callback);
}

//Get reseauxSociaux who i am Admin
module.exports.getReseauxSociauxAdmin = function(id,callback){
    var query = {admin: id};
	ReseauSocial.find(query, callback);
}

//Get reseauxSociaux where i subbscribed
module.exports.getReseauxSociauxAbonne = function(id,callback){
    var query = {abonnes:{$in : id}};
	ReseauSocial.find(query, callback);
}

//Get admin
module.exports.getAdmin = function(id, callback){
    ReseauSocial.findById(id)
    .populate('UserApp')
    .exec(function(err, res){
        callback(err, res.admin);
    });
}

//Get list of abonne
module.exports.getAbonnes = function(id, callback){
    ReseauSocial.findById(id)
    .populate('UserApp')
    .exec(function(err, res){
        callback(err, res.abonnes);
    });
}

//Get reseauxSociaux by preferences
module.exports.getReseauSocialByPreferences = function(req, callback){
    ReseauSocial.find( {preferences : {$in : req}}, callback);      
}

/*module.exports.getReseauSocialByPreferences = function(req, callback){
    Commerce.find( {preferences : {$nor : req}},function(err, nocom){
        Commerce.find({$nor : nocom}, function(err, commerces){
            callback(err, commerces)
        })
    });      
}*/
