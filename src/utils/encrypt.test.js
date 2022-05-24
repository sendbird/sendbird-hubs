const { encrypt, decrypt } = require('./encrypt');
test('encrypt then decrypt', () => {
    const encryptedString = encrypt("api-key");
    const decryptedString = decrypt(encryptedString);
    expect(decryptedString).toEqual('api-key');

});