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
        expect(response.body.access_token).toEqual("bc0b3bf7c7ebc5e08a7db16fe13a8e86a8a94f45");

        nockDone();

    });

    test('return existing user if already user for session id', () => {

    });

    test('handle bad input data', () => {

    });
});