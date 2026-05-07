const http = require('http')      
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan('tiny'))


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

app.post('/api/persons', (request, response) => { 
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    }
    const nameExists = persons.find(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({error: 'name must be unique'})
    }

    const id = Math.floor(Math.random() * 1000).toString()
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons.push(person)
    response.json(persons)
}) 

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)