const request = require('supertest');
const nockBack = require('nock').back
const { Room } = require('../src/models');
const createServer = require('../src/server');
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('dryrun');

beforeEach(async () => {
    await Room.sync({ force: true, logging: false });
});

test('create room', async () => {
    const { nockDone, context } = await nockBack('create-channel.json');

    const app = createServer();
    const response = await request(app)
        .post('/room')
        .send({ roomId: 'channel-url', sbAppId: '4B7775C5-4F19-428D-93BA-6747DA590381', sbApiToken: 'eb9ff15baf3972042a691e5f0b5dcea3a59d592f' })
        .set('Accept', 'application/json')
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ channelUrl: 'channel-url' });
    nockDone();


});

test('create room no app id', async () => {
    const app = createServer();
    const response = await request(app)
        .post('/room')
        .send({ roomId: 'channel-url', sbApiToken: '1234' })
        .set('Accept', 'application/json')
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
        error: 'no app id specified'
    });
});

test('create room api token', async () => {
    const app = createServer();
    const response = await request(app)
        .post('/room')
        .send({ sbAppId: '1234' })
        .set('Accept', 'application/json')
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
        error: 'no room id specified'
    });
});

test('join room for first time', async () => {
    const nockBackUserNotFound = await nockBack('view-user-not-found.json');
    const nockBackCreateUser = await nockBack('create-user.json');
    const nockBackJoinChannel = await nockBack('invite-to-channel.json');

    const app = createServer();
    const newRoom = await Room.create({ channelUrl: '1234', sbAppId: '4B7775C5-4F19-428D-93BA-6747DA590381', sbApiToken: 'eb9ff15baf3972042a691e5f0b5dcea3a59d592f' });

    const response = await request(app)
        .post('/room/join')
        .send({ channelUrl: '1234', sessionId: 'abc123', nickname: 'bob' })
        .set('Accept', 'application/json');
    expect(response.status).toEqual(200);
    expect(response.body.userId).toEqual("abc123");
    expect(response.body.accessToken.length > 0).toBe(true);

    nockBackUserNotFound.nockDone();
    nockBackCreateUser.nockDone();
    nockBackJoinChannel.nockDone();


});

test('join room again', async () => {
    const { nockDone, context } = await nockBack('view-user.json');

    const app = createServer();
    const newRoom = await Room.create({ channelUrl: '1234', sbAppId: '4B7775C5-4F19-428D-93BA-6747DA590381', sbApiToken: 'eb9ff15baf3972042a691e5f0b5dcea3a59d592f' });

    const response = await request(app)
        .post('/room/join')
        .send({ channelUrl: '1234', sessionId: 'abc123', nickname: 'bob' })
        .set('Accept', 'application/json')
    expect(response.status).toEqual(200);
    expect(response.body.userId).toEqual("abc123");
    expect(response.body.accessToken.length > 0).toBe(true);
    nockDone();
});