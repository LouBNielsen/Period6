var _ = require("lodash");
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var passport = require("passport"); //framework 
var passportJWT = require("passport-jwt"); //framework strategy

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var users = [
    {
        id: 1,
        name: 'jonathanmh',
        password: '%2yx4'
    },
    {
        id: 2,
        name: 'test',
        password: 'test'
    }
];

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil'; //secret til at verify at ens token er okay

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:
    var user = users[_.findIndex(users, { id: jwt_payload.id })]; //strategy
    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

passport.use(strategy); //brug denne strategy

var app = express(); //middlewawre - order matters
app.use(passport.initialize());

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json())

app.get("/", function (req, res) { //routes, manuelt (normalt ville vi have dette i e router fil)
    res.json({ message: "Express is up!" });
});

app.post("/login", function (req, res) { //vi kan ikke hente en url: /localhost:3000/login, da det er post og ikke get
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;
    }
    // usually this would be a database call:
    var user = users[_.findIndex(users, { name: name })]; //_. package, utility functions heri. (require lodash)
    if (!user) {
        //Problem, fortæller hackeren hvad fejlen var. Det var brugernavnet der var fejlen og ikke passworded
        res.status(401).json({ message: "no such user found" }); //Failed to login skal skrives i stedet for.
    }

    if (user.password === req.body.password) {
        // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
        var payload = { id: user.id }; //vi kan tilføje en hel del herinde, fx brugertype eller info (pas på, intet fortroligt!)
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        // Vi skal huske en timeout på vores token! eller hvis en hacker får det, kan han bruge det forevigt.
        // Add lifetime to token
        res.json({ message: "ok", token: token });
    } else {
        res.status(401).json({ message: "passwords did not match" });
    }
});


// hvis man ikke er logget ind, så vil sessionen vide det (middelware kan også håndtere det)
// hvis man er logget ind så kaldes next() og hvis ikke, så kalder man ikke next())
app.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json({ message: "Success! You can not see this without a token" });
});

app.get("/secretDebug",
    function (req, res, next) {
        console.log(req.get('Authorization'));
        next();
    }, function (req, res) {
        res.json("debugging");
    });

app.listen(3000, function () {
    console.log("Express running");
});