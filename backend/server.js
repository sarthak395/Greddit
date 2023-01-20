const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
    res.json({message:'Hello World!'});
});

app.listen(9000, () => {
    console.log('Server started on port 9000');
});