const SendbirdPlatformSdk = require('sendbird-platform-sdk');
const { Room } = require('../models/index.js');

const joinRoom = async (req, res) => {
    const { channelUrl, sessionId, nickName } = req.body
    try {
        // get room by room id
        const room = await Room.findOne({ where: { channelUrl: channelUrl } });
        const userApiInstance = new SendbirdPlatformSdk.UserApi();
        userApiInstance.apiClient.basePath = `https://api-${room.sbAppId}.sendbird.com`;

        const userId = sessionId;

        const existingUser = await userApiInstance.viewUserById(room.sbApiToken, userId).catch((e) => { console.log(e) });
        if (existingUser?.user_id) {
            return res.json({ userId: existingUser.user_id, accessToken: existingUser.access_token });
        } else {
            console.log('- -  - yep now create a user');
            const createUserData = new SendbirdPlatformSdk.CreateUserData();
            console.log(createUserData);
            createUserData.user_id = sessionId;
            createUserData.nickname = nickName;
            createUserData.profile_url = "";
            createUserData.issue_access_token = true;
            const opts = {
                'createUserData': createUserData
            };
            const newUser = await userApiInstance.createUser(room.sbApiToken, opts).catch((e) => { console.log(e) });

            const groupChannelApiInstance = new SendbirdPlatformSdk.GroupChannelApi();
            const inviteData = new new SendbirdPlatformSdk.GcInviteAsMembersData();
            inviteData.user_id = newUser.user_id;
            const channelInviteOpts = {
                'gcInviteAsMembersData': inviteData
            };
            await groupChannelApiInstance.gcInviteAsMembers(room.sbApiToken, channelUrl, channelInviteOpts).catch((e) => { console.log(e) });
            return res.json({ userId: newUser.user_id, accessToken: newUser.access_token });

        }
        // check to see if user with session id exits
        // create new user if not
        // add user too group

    } catch (e) {
        console.log(e);

        res.status(500);
        return res.json({ error: 'server side error' })

    }

}

module.exports = joinRoom;