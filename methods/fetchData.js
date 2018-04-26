var fetch = require("node-fetch");
var DOMParser = require('xmldom').DOMParser;


var methods = {};

methods.getAuthToken = async function (loginData) {

    // construct fetch data 
    var path = '/auth-apis/auth/1.0/authenticate/';
    var param = '';
    var url = loginData.uri + path + loginData.billingID + param
    console.log("authorization token URL: " + url);

    var postBody = {
        "authRequest": {
            "maaS360AdminAuth": {
                "billingID": loginData.billingID, //"30081687", //billingID,
                "platformID": loginData.platformID, //"3", //platformID,
                "appID": loginData.appID, //"com.30081687.api", //appID,
                "appVersion": loginData.appVersion, //"1.0", //appVersion,
                "appAccessKey": loginData.appAccessKey, //"7I6067cMtT", //appAccessKey,
                "userName": loginData.userName, //"jonas.schindzielorz1@gmail.com", //userName,
                "password": loginData.password, //"090912Ana." //password
            }
        }
    };

    var reqInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody),
        mode: 'cors',
        cache: 'application/json'
    };


    //Fetch
    const response = await fetch(url, reqInit);
    const data = await response.text();

    //Data handling
    var doc = new DOMParser().parseFromString(data);
    var tokenNum = doc.getElementsByTagName("authToken")[0].childNodes[0].nodeValue;
    var authToken = 'MaaS token="' + tokenNum + '"';

    // return
    return authToken;

}

methods.getUsers = async function (authToken, loginData) {

    // construct fetch data 
    var path = '/user-apis/user/1.0/search/';
    var param = '?includeAllUsers=1';
    var url = loginData.uri + path + loginData.billingID + param
    console.log("get user URL: " + url);

    var reqInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': authToken,
        },
        mode: 'cors',
        cache: 'default'
    };

    //Fetch
    const response = await fetch(url, reqInit);
    const data = await response.text();

    //Data handling
    var doc = new DOMParser().parseFromString(data);
    var user = {};
    var userArray = [];
    var usersJson = doc.getElementsByTagName("user");

    for (let index = 0; index < usersJson.length; index++) {

        // pick tags which you wanna use
        user.uId = doc.getElementsByTagName("userIdentifier")[index].childNodes[0].nodeValue;
        user.uMail = doc.getElementsByTagName("emailAddress")[index].childNodes[0].nodeValue;
        user.uName = doc.getElementsByTagName("fullName")[index].childNodes[0].nodeValue;

        userArray.push(new Object({
            ID: user.uId,
            Mail: user.uMail,
            Name: user.uName
        }));
    }

    // return
    return userArray;
}

methods.getDevices = async function (authToken, loginData) {
    // construct fetch data 
    var path = '/device-apis/devices/1.0/search/';
    var param = '?deviceStatus=Active';
    var url = loginData.uri + path + loginData.billingID + param
    console.log("get user URL: " + url);

    var reqInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': authToken,
        },
        mode: 'cors',
        cache: 'default'
    };

    //Fetch
    const response = await fetch(url, reqInit);
    const data = await response.text();

    //Data handling
    var doc = new DOMParser().parseFromString(data);
    var device = {};
    var allDevices = doc.getElementsByTagName("device");
    deviceArray = [];

    for (let index = 0; index < allDevices.length; index++) {

        // pick tags which you wanna use
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

    // return
    return deviceArray;
}



methods.getcellularData = async function (authToken, loginData, deviceID) {
    // construct fetch data 
    var path = '/device-apis/devices/1.0/locationHistory/';
    var param = '?deviceId=' + deviceID;
    var url = loginData.uri + path + loginData.billingID + param
    console.log("location URL: " + url);

    var reqInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': authToken,
        },
        mode: 'cors',
        cache: 'default'
    };

    //Fetch
    const response = await fetch(url, reqInit);
    const data = await response.text();

    var doc = new DOMParser().parseFromString(data);
    if (deviceID != "Android9997bdb5203d6913") {
        //!!!! have to find a solution to check the tag for location without a shordump !!!!

        var cellularData = {
            lat: "",
            long: "",
            accuracy: "0",
            loctime: "0",
            error: "Location doesnt excist"
        }

    } else {
        var lat = doc.getElementsByTagName("latitude")[0].childNodes[0].nodeValue;
        var long = doc.getElementsByTagName("longitude")[0].childNodes[0].nodeValue;
        var accuracy = doc.getElementsByTagName("accuracy")[0].childNodes[0].nodeValue;
        var status = doc.getElementsByTagName("checkedInStatus")[0].childNodes[0].nodeValue;
        var loctime = doc.getElementsByTagName("locatedTime")[0].childNodes[0].nodeValue;
        var maas360DeviceID = doc.getElementsByTagName("maas360DeviceID")[0].childNodes[0].nodeValue;

        cellularData = {
            lat: lat,
            long: long,
            accuracy: accuracy,
            loctime: loctime,
            status: status,
            error: "",
            maas360DeviceID: maas360DeviceID,
            user: ""
        };
    }

    console.log(cellularData)

    return cellularData;
}


methods.getDeviceSoftware = async function (authToken, loginData, deviceID) {
    // construct fetch data 
    var path = '/device-apis/devices/1.0/softwareInstalled/';
    var param = '?deviceId=' + deviceID;
    var url = loginData.uri + path + loginData.billingID + param
    console.log("location URL: " + url);

    var reqInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': authToken,
        },
        mode: 'cors',
        cache: 'default'
    };

    //Fetch
    const response = await fetch(url, reqInit);
    const data = await response.text();

    //Data handling
    var doc = new DOMParser().parseFromString(data);
    var appArray = []
    var allApps = doc.getElementsByTagName("swName");

    for (let index = 0; index < allApps.length; index++) {

        // pick tags which you wanna use
        appArray.push(doc.getElementsByTagName("swName")[index].childNodes[0].nodeValue);
    }


    //console.log(appArray)

    // return
    return appArray;

}





// export functions
exports.data = methods;