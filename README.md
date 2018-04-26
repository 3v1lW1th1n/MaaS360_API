# MaaS360_API - Node js
This is a MaaS360 API sample which requests a MaaS360 authentication token and pull the user and device data from your MaaS360 Account.
The IPA includes a Monitoring which lists all devices without a checked in status and a simple User view. The Device view allows you to display selected device details, a list with all programs on the device and a map with the device location as well.

After pulling the project, type “npm install” in your terminal to use the “package.json” to download the necessary dependencies and get started.


Dependencies:

"body-parser": "^1.18.2"

"ejs": "^2.5.8"

"express": "^4.16.3"

"node-fetch": "^2.1.2"

"xmldom": "^0.1.27"



You will need the required information to create an authentication token which are provided by MaaS360:



Requierd information:

billingID

platformID

appID

appVersion

appAccessKey

userName (MaaS360 Admin)

password (MaaS360 Admin Password)



Once you have this, type the data into the index view and you can test your own MaaS360 API.



Also, you want to take a look at this:



URL Generator:
https://maas360apidocs.mybluemix.net



WebServices Reference guide:
https://ibm.box.com/v/MaaS360webservices



How to connect to MaaS360:
https://www.ibm.com/developerworks/community/forums/html/topic?id=00000bb7-eeea-40f7-8635-6f442583698b
