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
        const APP_ID = "6C1652F3-FD66-49F8-BA4C-0B7D53E132A0";
        const userApiInstance = new SendbirdPlatformSdk.UserApi();
        userApiInstance.apiClient.basePath = `https://api-${APP_ID}.sendbird.com`;
        // get user if exists;
        const data = await userApiInstance.createUser('109c07eb18905ed64d7d94af5a415f0589e11204', opts);
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