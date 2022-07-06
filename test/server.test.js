const request = require('supertest');
const nockBack = require('nock').back
const createServer = require('../src/server');
nockBack.fixtures = __dirname + '/fixtures';
nockBack.setMode('dryrun');


describe('create user', () => {
    test('create user with access token', async () => {
        const { nockDone, context } = await nockBack('create-sb-user.json');

        const app = createServer();
        const response = await request(app)
            .post('/user')
            .send({ sessionId: '1234', name: 'bob' })
            .set('Accept', 'application/json');
        expect(response.status).toEqual(200);
        expect(response.body.access_token).toEqual("fb280608e108562149cc8e9644d4c94dc3a83e79");

        nockDone();

    });

    test('dont create user if one already exists', async () => {
        const { nockDone, context } = await nockBack('user-exists.json');

        const app = createServer();
        const response = await request(app)
            .post('/user')
            .send({ sessionId: '1234', name: 'bob' })
            .set('Accept', 'application/json');
        expect(response.status).toEqual(200);
        expect(response.body.access_token).toEqual("fb280608e108562149cc8e9644d4c94dc3a83e79");

        nockDone();

    });
});