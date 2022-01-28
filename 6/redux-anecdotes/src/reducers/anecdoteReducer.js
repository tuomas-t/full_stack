import anecdoteService from '../services/anecdoteService'

const anecdoteReducer = (state = [], action) => {
  switch(action.type) {
    case 'VOTE':
      return state.map(a =>
        a.id !== action.data.id ? a : action.data
      )
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    case 'SET_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const setAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAnecdotes()
    dispatch({
      type: 'SET_ANECDOTES',
      data: anecdotes,
    })
  }
}

export const addVote = (anecdote) => {
  return async dispatch => {
    const newObj = await anecdoteService.update({...anecdote, votes: anecdote.votes + 1}, anecdote.id)
    dispatch({
      type: 'VOTE',
      data: newObj,
    })
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(anecdote)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export default anecdoteReducer