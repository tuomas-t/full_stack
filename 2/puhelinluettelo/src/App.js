import React, { useState, useEffect  } from 'react'
import personService from './services/persons'

const Persons = ({name, number, id, removePerson}) => {
  return (
    <div>
      <p>{name} {number} <button onClick={() => removePerson(name, id)} >delete</button></p>
    </div>
  )
}

const Filter = (props) => {
  return (
    <form onSubmit={props.handleSubmit}>
        <div>
          filter shown with: <input 
          onChange={props.handleFiltering}
          />
        </div>
      </form>
  )
}

const PersonForm = (props) => {
  return (
  <form onSubmit={props.handleSubmit}>
        <div>
          name: <input 
          value={props.newName}
          onChange={props.handleNimiChange}
          />
        </div>
        <div>
          number: <input 
          value={props.newNumber}
          onChange={props.handleNumChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [show, setShow] = useState('')
  const [message, setMessage] = useState([])

  useEffect(() => {
    personService
      .getAll()
        .then(initPersons => {
        setPersons(initPersons)
      })
  }, [])

  const removePerson = (name, id) => {
    if (window.confirm(`Delete ${name}`)) {
      personService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
      setMessage([`Deleted ${name}`, false])
      setTimeout(() => {setMessage([])}, 3000)
    } 
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    let flag = false
    for (let i = 0; i < Object.keys(persons).length; i++) {
      if (persons[i].name === newName) {
        flag = true
      }
    }
    
    if (flag) {
      if (window.confirm(`${newName} already exists, replace the old number with ${newNumber}`)) {
        const personObj = {
          name: newName,
          number: newNumber
        }
        let personId = ''
        for (let i = 0; i < Object.keys(persons).length; i++) {
          if (persons[i].name === newName) {
            personId = persons[i].id
          }
        }

        personService.update(personId, personObj)
        .then(oldPersons => {
          setPersons(persons.map(person => person.id !== personId ? person : oldPersons))
          setMessage([`Updated ${newName}`, false])
        }).catch(error => {
          setMessage([`Information of  ${newName} has aready been removed from server`, true])
          setPersons(persons.filter(person => person.id !== personId))
        })
        setNewName('')
        setNewNumber('')
        setTimeout(() => {setMessage([])}, 3000)
      }
      
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      personService.create(personObj).then(oldPersons => {
        setPersons(persons.concat(oldPersons))
        
        setMessage([`Added ${newName}`, false])
        setTimeout(() => {setMessage([])}, 3000)
      })
      
    }
    setNewName('')
    setNewNumber('')
  }

  const searchPersons = () => {
    if (show === '') {
      return persons
    } else {
      return persons.filter(person => person.name.toLowerCase().includes(show.toLowerCase()))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleSubmit={addName} handleFiltering={(event) => setShow(event.target.value)} />
      
      <h2>add a new</h2>
      <PersonForm handleNimiChange={handleNameChange} handleNumChange={handleNumberChange} handleSubmit={addName} />
      
      <h2>Numbers</h2>
      {searchPersons().map(person => 
        <Persons key={person.name} name={person.name} number={person.number} id={person.id} removePerson={removePerson} />
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message.length === 0) {
    return null
  }
  if (message[1]) {
    return (
      <div className="error">
        {message[0]}
      </div>
    )
  } else {
    return (
      <div className="success">
        {message[0]}
      </div>
    )
  }  
}

export default App