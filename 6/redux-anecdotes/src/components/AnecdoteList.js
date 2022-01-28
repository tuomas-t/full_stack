import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  console.log(anecdotes)
  const filteredAnecdotes = anecdotes.filter(anec => anec.content.includes(filter)).sort((a, b) => b.votes - a.votes) 

  const vote = (anecdote) => {
    dispatch(addVote(anecdote))
    dispatch(addNotification(`You voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList