const http = require('http')      
const express = require('express')
const app = express()

app.use(express.json())



let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan abramov",
        number: "8905789483"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "8786573208"
    }
]

app.get('/', (request, response)=> {
    response.send('<h1>The Project</h1>')
})

app.get('/api/persons',(request, response)=> {
    response.json(persons)
})

app.get('/info',(request, response)=> {
    const count = persons.length
    const time = new Date()
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
        `)
})
  

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)