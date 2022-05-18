const SendbirdPlatformSdk = require('sendbird-platform-sdk');
const { Room } = require('../models/index.js');

const createRoom = async (req, res) => {
    const { roomId, sbAppId, sbApiToken } = req.body;

    if (!sbAppId) {
        res.status(400)
        return res.json({
            error: 'no app id specified'
        });
    }

    if (!sbApiToken) {
        res.status(400)
        return res.json({
            error: 'no api token specified'
        });
    }

    // call api
    try {
        const newRoom = await Room.create({ channelUrl: roomId, sbAppId, sbApiToken });
        const channeldata = new SendbirdPlatformSdk.GcCreateChannelData();
        channeldata.channel_url = newRoom.channelUrl;

        const opts = {
            'gcCreateChannelData': channeldata
        };

        const groupChannelApiInstance = new SendbirdPlatformSdk.GroupChannelApi();
        groupChannelApiInstance.apiClient.basePath = `https://api-${sbAppId}.sendbird.com`;
        const data = await groupChannelApiInstance.gcCreateChannel(sbApiToken, opts);
        res.json({ channelUrl: data.channel_url });

    } catch (e) {
        console.log(e);

        res.status(500);
        return res.json({ error: 'server side error' })
    }

}

module.exports = createRoom;