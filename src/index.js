const createServer = require('./server');
const port = 3000

const server = createServer();
server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})