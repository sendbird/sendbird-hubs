const SendbirdPlatformSdk = require('sendbird-platform-sdk');
const { Room } = require('../models/index.js');

const buildCreateUserOpts = (sessionId, nickname) => {
    const createUserData = new SendbirdPlatformSdk.CreateUserData();
    createUserData.user_id = sessionId;
    createUserData.nickname = nickname;
    createUserData.profile_url = "";
    createUserData.issue_access_token = true;
    const opts = {
        'createUserData': createUserData
    };
    return opts;
}

const buildInviteMemberOpts = (user) => {
    const inviteData = new SendbirdPlatformSdk.GcInviteAsMembersData();
    inviteData.user_ids = [user.user_id];
    const opts = {
        'gcInviteAsMembersData': inviteData
    };
    return opts;
}

const joinRoom = async (req, res) => {
    const { channelUrl, sessionId, nickname } = req.body
    try {
        // get room by room id
        const room = await Room.findOne({ where: { channelUrl: channelUrl } });
        const userApiInstance = new SendbirdPlatformSdk.UserApi();
        userApiInstance.apiClient.basePath = `https://api-${room.sbAppId}.sendbird.com`;
        const existingUser = await userApiInstance.viewUserById(room.sbApiToken, sessionId).catch((e) => { });

        if (existingUser?.user_id) {
            return res.json({ userId: existingUser.user_id, accessToken: existingUser.access_token });
        } else {
            const groupChannelApiInstance = new SendbirdPlatformSdk.GroupChannelApi();

            const createUserOpts = buildCreateUserOpts(sessionId, nickname);
            const newUser = await userApiInstance.createUser(room.sbApiToken, createUserOpts).catch((e) => { console.log(e) });

            const inviteMemberOpts = buildInviteMemberOpts(newUser);
            await groupChannelApiInstance.gcInviteAsMembers(room.sbApiToken, channelUrl, inviteMemberOpts).catch((e) => { console.log(e) });
            return res.json({ userId: newUser.user_id, accessToken: newUser.access_token, appId: room.sbAppId });

        }

    } catch (e) {
        console.log(e);
        res.status(500);
        return res.json({ error: 'server side error' })

    }

}

module.exports = joinRoom;