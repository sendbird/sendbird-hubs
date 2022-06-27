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
        expect(response.body.access_token).toEqual("d55953ea97376a7dbae00081d5f044113a13950c");

        nockDone();

    });
});