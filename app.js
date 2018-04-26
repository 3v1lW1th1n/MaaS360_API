//----------------------------------------------------------------Setups-----------------------------------------------------------------------------------------------------------------------

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fetch = require("node-fetch");
var DOMParser = require('xmldom').DOMParser;
const methods = require('./methods/fetchData.js');

// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.set('view engine', 'ejs');

//Request variables
var parser;
var authToken;

var loginData = {
    uri: "",
    billingID: "",
    platformID: "",
    appID: "",
    appVersion: "",
    appAccessKey: "",
    userName: "",
    password: ""
}

var selectedUser = {};
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

app.get('/monitoring', function (req, res) {

    methods.data.getDevices(authToken, loginData)
        .then(function (devicesArray) {

            var noCoreDate = {};

            deviceArray.forEach(function (deviceItem) {
                methods.data.getcellularData(authToken, loginData, deviceItem.maas360DeviceID)
                    .then(function (cellularData) {

                        var currentDate = new Date();
                        var itemDate = new Date(cellularData.loctime);
                        var cellularDataArray = [];

                        if (currentDate.getHours() < itemDate.getHours() || String(cellularData.status) == "No") {
                            cellularData.user = deviceItem.username;
                            cellularDataArray.push(cellularData);

                        }
                        console.log("Device Item: ", cellularDataArray[0])

                        res.render('monitoring', {
                            cellularDataArray: cellularDataArray,
                        })
                    });
            });
        });
});

app.get('/users', function (req, res) {
    methods.data.getUsers(authToken, loginData)
        .then(function (userArray) {


            res.render('users', {
                userArray: userArray,
                selectedUser: selectedUser
            })
        });
});

app.get('/devices', function (req, res) {
    methods.data.getDevices(authToken, loginData)
        .then(function (devicesArray) {

            var cellularData = {};
            var appArray = [];

            res.render('devices', {
                deviceArray: deviceArray,
                selectedDevice: selectedDevice,
                cellularData: cellularData,
                appArray: appArray,
            });
        });
});


//----------------------------------------------------------------POST-----------------------------------------------------------------------------------------------------------------------
app.post('/index', urlencodedParser, function (req, res) {

    res.render('index')
});


app.post('/monitoring', urlencodedParser, function (req, res) {

    loginData.uri = req.body.host;
    loginData.billingID = req.body.billingID; //"30081687",//billingID,
    loginData.platformID = req.body.platformID; //"3",//platformID,
    loginData.appID = req.body.appID; //"com.30081687.api",//appID,
    loginData.appVersion = req.body.appVersion; //"1.0",//appVersion,
    loginData.appAccessKey = req.body.appAccessKey; //"7I6067cMtT",//appAccessKey,
    loginData.userName = req.body.userName; //userName,
    loginData.password = req.body.password; //password    

    methods.data.getAuthToken(loginData)
        .then(function (result) {
            authToken = result;


            methods.data.getDevices(authToken, loginData)
                .then(function (devicesArray) {

                    var noCoreDate = {};

                    deviceArray.forEach(function (deviceItem) {
                        methods.data.getcellularData(authToken, loginData, deviceItem.maas360DeviceID)
                            .then(function (cellularData) {

                                var currentDate = new Date();
                                var itemDate = new Date(cellularData.loctime);
                                var cellularDataArray = [];

                                if (currentDate.getHours() < itemDate.getHours() || String(cellularData.status) == "No") {
                                    cellularData.user = deviceItem.username;
                                    cellularDataArray.push(cellularData);

                                }
                                console.log("Device Item: ", cellularDataArray[0])

                                res.render('monitoring', {
                                    cellularDataArray: cellularDataArray,
                                })
                            });
                    });
                });
        });
});


app.post('/users', urlencodedParser, function (req, res) {

    methods.data.getUsers(authToken, loginData)
        .then(function (userArray) {

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
        });
});

app.post('/devices', urlencodedParser, function (req, res) {

    methods.data.getDevices(authToken, loginData)
        .then(function (devicesArray) {

            deviceArray.forEach(function (index) {
                if (String(index.maas360DeviceID) === String(req.body.device)) {
                    selectedDevice = index;
                }
            });

            if (selectedDevice === "- Devices -") {

                var appArray = [];

                res.render('devices', {
                    deviceArray: deviceArray,
                    selectedDevice: selectedDevice,
                    cellularData: cellularData,
                    appArray: appArray
                });
            };

            methods.data.getcellularData(authToken, loginData, req.body.device)
                .then(function (cellularData) {

                    methods.data.getDeviceSoftware(authToken, loginData, req.body.device)
                        .then(function (appArray) {

                            res.render('devices', {
                                deviceArray: deviceArray,
                                selectedDevice: selectedDevice,
                                cellularData: cellularData,
                                appArray: appArray,
                            });
                        });
                });
        });
});

//----------------------------------------------------------------Server start-----------------------------------------------------------------------------------------------------------------------

app.listen(3000);