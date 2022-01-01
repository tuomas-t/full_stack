import React, { useState, useEffect  } from 'react'
import personService from './services/persons'
import './index.css'

const Persons = ({name, number, removePerson}) => {
  return (
    <div>
      <p>{name} {number} <button onClick={() => removePerson} >delete</button></p>
    </div>
  )
}

const Filter = ({handleSubmit, handleFiltering}) => {
  return (
    <div>
      <p>
        filter shown with: <input 
        value={handleSubmit}
        onChange={handleFiltering}
        />
      </p>
    </div>
  )
}

const PersonForm = ({handleNameChange, handleNumberChange, handleSubmit, newName, newNumber}) => {
  return (
  <form onSubmit={handleSubmit}>
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}
          />
        </div>
        <div>
          number: <input 
          value={newNumber}
          onChange={handleNumberChange}
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
  const [message, setMessage] = useState({
    msg: undefined,
    err: undefined
  })

  useEffect(() => {
    personService
      .getAll()
        .then(initPersons => {
        setPersons(initPersons)
      })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMessage({msg: undefined, err: undefined})
    }, 3000)
  }, [show])

  const displayMessage = (text, error) => {
    setMessage({text, error})
    setTimeout(() => {
      setMessage({undefined, undefined})
    }, 3000)
  }

  const removePerson = (name, id) => {
    if (window.confirm(`delete ${name}?`)) {
      personService.deletePerson(id)
      setPersons(persons.filter(person => person.id !== id))
      displayMessage(`Deleted ${name}`, false)
      //.catch(error => {
      //  setMessage(`Deleted ${name}`, true)
      //  setPersons(persons.map(person => person.id !== id ? person : initPersons))})
      //}
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
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
          setPersons(persons.map(p => p.id !== personId ? p : oldPersons))
          displayMessage(`Updated ${newName}`, false)
        })
      }
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      personService.create(personObj).
      then(oldPersons => {
        setPersons(persons.concat(oldPersons))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${newName}`, false)
      }).catch(error => {
        setMessage(`Failed to add ${newName}`, true)
      })
    }
  }

  const searchPersons = () => {
    if (show === '') {
      return persons
    } else {
      return persons.filter(person => person.name.toLowerCase().includes(show.toLowerCase()))
    }
  }
  console.log(message)

  const handleSetShow = (event) => {
    setShow(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.msg} error={message.err} />
      <Filter handleSubmit={show} handleFiltering={handleSetShow} />
      
      <h2>add a new</h2>
      <PersonForm handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={addName} newName={newName} newNumber={newNumber} />
      
      <h2>Numbers</h2>
      {searchPersons().map(person => 
        <Persons key={person.name} name={person.name} number={person.number} id={person.id} removePerson={() => removePerson(person)} />
      )}
    </div>
  )
}

const Notification = ({ message, error }) => {
  console.log(message)
  if (message === undefined) {
    return null
  } 
  
  if (error) {
    return (
      <div className="error">
        {message}
      </div>
    )
  } else {
    return (
      <div className="success">
        {message}
      </div>
    )
  }
}

export default App