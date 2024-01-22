// server.js
const express = require('express')
const app = express()

// Start server
const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.get('/api/data', (req, res) => {
  res.status(200).json(dataStore)
})
