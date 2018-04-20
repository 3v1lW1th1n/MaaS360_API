//----------------------------------------------------------------Setups-----------------------------------------------------------------------------------------------------------------------

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fetch = require("node-fetch");
var DOMParser = require('xmldom').DOMParser;

// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.set('view engine', 'ejs');

//Request variables
const uri = 'https://services.m3.maas360.com'; // there are three different links. Make sure you take the right one
var parser;
var tokenNum;
var authToken;
var billingID;
var platformID;
var appID;
var appVersion;
var appAccessKey;
var userName;
var password;


var userArray = [];
var selectedUser = {};

var deviceArray = [];
var selectedDevice = {};


//----------------------------------------------------------------Routing-----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------GET-----------------------------------------------------------------------------------------------------------------------
app.get('/', function (req, res) {
    console.log(req.query)
    res.render('index')
});

app.get('/index', function (req, res) {
    console.log(req.query)
    res.render('index');
});

app.get('/users', function (req, res) {
    res.render('users', {
        userArray: userArray,
        selectedUser: selectedUser
    })
});

app.get('/devices', function (req, res) {
    console.log(req.query)
    res.render('devices', {
        deviceArray: deviceArray,
        selectedDevice: selectedDevice
    });
});


//----------------------------------------------------------------POST-----------------------------------------------------------------------------------------------------------------------
app.post('/index', urlencodedParser, function (req, res) {

    var method = 'POST';
    var mode = 'cors';
    var cache = 'default';
    var contentType = 'application/json';
    billingID = req.body.billingID;
    var path = '/auth-apis/auth/1.0/authenticate/';

    var url = uri + path + billingID; //"https://services.m3.maas360.com/auth-apis/auth/1.0/authenticate/********" 
    console.log("authorization token URL: " + url);

    billingID = req.body.billingID; //"30081687",//billingID,
    platformID = req.body.platformID; //"3",//platformID,
    appID = req.body.appID; //"com.30081687.api",//appID,
    appVersion = req.body.appVersion; //"1.0",//appVersion,
    appAccessKey = req.body.appAccessKey; //"7I6067cMtT",//appAccessKey,
    userName = req.body.userName; //"jonas.schindzielorz1@gmail.com",//userName,
    password = req.body.password; //"090912Ana."//password    

    var postBody = {
        "authRequest": {
            "maaS360AdminAuth": {
                "billingID": req.body.billingID, //"30081687",//billingID,
                "platformID": req.body.platformID, //"3",//platformID,
                "appID": req.body.appID, //"com.30081687.api",//appID,
                "appVersion": req.body.appVersion, //"1.0",//appVersion,
                "appAccessKey": req.body.appAccessKey, //"7I6067cMtT",//appAccessKey,
                "userName": req.body.userName, //"jonas.schindzielorz1@gmail.com",//userName,
                "password": req.body.password, //"090912Ana."//password
            }
        }
    };

    var reqInit = {
        method: method,
        headers: {
            'Content-Type': contentType
        },
        body: JSON.stringify(postBody),
        mode: mode,
        cache: cache
    };

    fetch(url, reqInit)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('authentication fetch faild');
            }
        })
        .then(function (resp) {
            var doc = new DOMParser().parseFromString(resp);
            tokenNum = doc.getElementsByTagName("authToken")[0].childNodes[0].nodeValue;
            authToken = 'MaaS token="' + tokenNum + '"';
            console.info("authorization: " + authToken);

            //Create user lsit -------------------------------------------------------------------------------------

            var method = 'GET';
            var mode = 'cors';
            var cache = 'default';
            var contentType = 'application/x-www-form-urlencoded';
            var path = '/user-apis/user/1.0/search/';
            var parameters = "?includeAllUsers=1";
            var billingID = req.body.billingID;

            var url = uri + path + billingID + parameters; //"https://services.m3.maas360.com/user-apis/user/1.0/search/********?includeAllUsers=1" 
            console.log("User search URL: " + url);

            var reqInit = {
                method: method,
                headers: {
                    'Content-Type': contentType,
                    'authorization': authToken,
                },
                mode: mode,
                cache: cache
            };

            fetch(url, reqInit)
                .then(function (response) {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('device fetch faild');
                    }
                })
                .then(function (resp) {
                    var doc = new DOMParser().parseFromString(resp);
                    var user = {};
                    var userArray = [];
                    var usersJson = doc.getElementsByTagName("user");

                    for (let index = 0; index < usersJson.length; index++) {

                        user.uId = doc.getElementsByTagName("userIdentifier")[index].childNodes[0].nodeValue;
                        user.uMail = doc.getElementsByTagName("emailAddress")[index].childNodes[0].nodeValue;
                        user.uName = doc.getElementsByTagName("fullName")[index].childNodes[0].nodeValue;

                        userArray.push(new Object({
                            ID: user.uId,
                            Mail: user.uMail,
                            Name: user.uName
                        }));
                    }

                    res.render('users', {
                        userArray: userArray,
                        selectedUser: selectedUser
                    });
                })
                .catch((err) => {
                    console.log('ERROR:', err.message);
                });
        })
        .catch((err) => {
            console.log('ERROR:', err.message);
        });
});


app.post('/users', urlencodedParser, function (req, res) {

    var method = 'GET';
    var mode = 'cors';
    var cache = 'default';
    var contentType = 'application/x-www-form-urlencoded';
    var path = '/user-apis/user/1.0/search/';
    var parameters = "?includeAllUsers=1";

    var url = uri + path + billingID + parameters; //"https://services.m3.maas360.com/user-apis/user/1.0/search/********?includeAllUsers=1" 
    console.log("User search URL: " + url);

    var reqInit = {
        method: method,
        headers: {
            'Content-Type': contentType,
            'authorization': authToken,
        },
        mode: mode,
        cache: cache
    };

    fetch(url, reqInit)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('users fetch faild');
            }
        })
        .then(function (resp) {
            var doc = new DOMParser().parseFromString(resp);
            var user = {};
            var usersJson = doc.getElementsByTagName("user");
            userArray = [];

            for (let index = 0; index < usersJson.length; index++) {

                user.uId = doc.getElementsByTagName("userIdentifier")[index].childNodes[0].nodeValue;
                user.uMail = doc.getElementsByTagName("emailAddress")[index].childNodes[0].nodeValue;
                user.uName = doc.getElementsByTagName("fullName")[index].childNodes[0].nodeValue;

                userArray.push(new Object({
                    ID: user.uId,
                    Mail: user.uMail,
                    Name: user.uName
                }));
            }

            userArray.forEach(function (index) {
                if (String(index.Name) === String(req.body.user)) {
                    selectedUser = index;
                }
            });

            console.log("selected User ", selectedUser);

            res.render('users', {
                userArray: userArray,
                selectedUser: selectedUser
            });
        })
});


app.post('/devices', urlencodedParser, function (req, res) {

    var method = 'GET';
    var mode = 'cors';
    var cache = 'default';
    var contentType = 'application/x-www-form-urlencoded';
    var path = '/device-apis/devices/1.0/search/';
    var parameters = "";

    var url = uri + path + billingID + parameters; //"https://services.m3.maas360.com/device-apis/devices/1.0/search/********" 
    console.log("User search URL: " + url);

    var reqInit = {
        method: method,
        headers: {
            'Content-Type': contentType,
            'authorization': authToken,
        },
        mode: mode,
        cache: cache
    };

    fetch(url, reqInit)
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('device fetch faild');
            }
        })
        .then(function (resp) {
            var doc = new DOMParser().parseFromString(resp);
            var device = {};
            var allDevices = doc.getElementsByTagName("device");
            deviceArray = [];

            for (let index = 0; index < allDevices.length; index++) {

                device.deviceName = doc.getElementsByTagName("deviceName")[index].childNodes[0].nodeValue;
                device.maas360DeviceID = doc.getElementsByTagName("maas360DeviceID")[index].childNodes[0].nodeValue;
                device.username = doc.getElementsByTagName("username")[index].childNodes[0].nodeValue;
                device.manufacturer = doc.getElementsByTagName("manufacturer")[index].childNodes[0].nodeValue;
                device.osName = doc.getElementsByTagName("osName")[index].childNodes[0].nodeValue;


                deviceArray.push(new Object({
                    deviceName: device.deviceName,
                    maas360DeviceID: device.maas360DeviceID,
                    username: device.username,
                    manufacturer: device.manufacturer,
                    osName: device.osName,
                }));
            }

            deviceArray.forEach(function (index) {
                if (String(index.maas360DeviceID) === String(req.body.device)) {
                    selectedDevice = index;
                }
            });

            console.log("selected Device ", selectedDevice);

            res.render('devices', {
                deviceArray: deviceArray,
                selectedDevice: selectedDevice
            });
        })
});

//----------------------------------------------------------------Server start-----------------------------------------------------------------------------------------------------------------------

app.listen(3000);