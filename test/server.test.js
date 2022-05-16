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
        .send({ sbApiToken: '1234' })
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
        error: 'no api token specified'
    });
});

test('join room', async () => {
    const app = createServer();
    const response = await request(app)
        .post('/room/join')
        .set('Accept', 'application/json')
    expect(response.status).toEqual(200);
    expect(response.body.userId).toEqual("bob1");
    expect(response.body.accessToken).toEqual("blahblahblah");


});