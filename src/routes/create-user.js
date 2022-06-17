const SendbirdPlatformSdk = require('sendbird-platform-sdk');

// const { Room } = require('../models/index.js');

const createRoom = async (req, res) => {
    const { sessionId, name } = req.body;



    if (!sessionId) {
        res.status(400)
        return res.json({
            error: 'no session id specified'
        });

    }

    if (!name) {
        res.status(400)
        return res.json({
            error: 'no name specified'
        });
    }

    const createUserData = new SendbirdPlatformSdk.CreateUserData(sessionId, name, "");
    createUserData.issue_access_token = true;

    const opts = {
        'createUserData': createUserData,
    };


    // call api
    try {
        const APP_ID = process.env.APP_ID;
        const API_KEY = process.env.API_KEY;
        const userApiInstance = new SendbirdPlatformSdk.UserApi();
        userApiInstance.apiClient.basePath = `https://api-${APP_ID}.sendbird.com`;
        // get user if exists;
        const data = await userApiInstance.createUser(API_KEY, opts);
        console.log(data);
        // save to database
        res.json({ access_token: data.access_token });

    } catch (e) {
        console.log(e);
        res.status(500);
        return res.json({ error: 'server side error' })
    }

}

module.exports = createRoom;