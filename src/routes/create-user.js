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

    const channelUrls = [
        'sendbird_group_channel_36291_0601d8164691d5fb3900791e7849406779691afe',
        'sendbird_group_channel_36291_695369e5c45f5db4319e7021f7139eecee8b166b',
        'sendbird_group_channel_36291_e5470f0bdd600595c39b93a2ac52c5e187b87a19',
        'sendbird_group_channel_36291_13683d422f023b1aec1092b3ff3e088e2077fefe'
    ];


    // call api
    try {
        const APP_ID = process.env.APP_ID;
        const API_KEY = process.env.API_KEY;
        const userApiInstance = new SendbirdPlatformSdk.UserApi();
        const channelApiInstance = new SendbirdPlatformSdk.GroupChannelApi();
        userApiInstance.apiClient.basePath = `https://api-${APP_ID}.sendbird.com`;
        channelApiInstance.apiClient.basePath = `https://api-${APP_ID}.sendbird.com`;

        // get user if exists;
        const data = await userApiInstance.createUser(API_KEY, opts);




        for (const channelUrl of channelUrls) {
            const joinChannelData = new SendbirdPlatformSdk.GcJoinChannelData();
            joinChannelData.user_id = data.user_id;
            joinChannelData.channel_url = channelUrl;
            const joinChannelOpts = {
                'gcJoinChannelData': joinChannelData
            }


            await channelApiInstance.gcJoinChannel(API_KEY, channelUrl, joinChannelOpts)

        }


        // save to database
        res.json({ access_token: data.access_token });

    } catch (e) {
        console.log(e);
        res.status(500);
        return res.json({ error: e })
    }

}

module.exports = createRoom;