var UserSchema = new mongoose.Schema({
  userName   : {type: String, unique: true, required: true},
  password:   {type : String, required: true}
});

UserSchema.pre("save",function(next){
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {return next(err);}
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) { return next(err);}
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw,callback){
  bcrypt.compare(passw,this.password, function (err, isMatch) {
    if(err){return callback(err);}
    callback(null,isMatch);
  });
};