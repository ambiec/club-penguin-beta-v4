let express = require('express');
let app = express();


app.use(express.static('public'));

let port = 3000;
app.listen(port, () => {
    console.log("Server listening on localhost: ", port);
});