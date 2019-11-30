let express = require('express')
let app = express()
app.get('/user', (req, res) => {
    res.json({code: 200,msg: 'success'})
})
app.listen(3001)