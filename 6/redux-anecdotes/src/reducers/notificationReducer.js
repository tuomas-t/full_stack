const notificationReducer = (state = '', action) => {
  switch(action.type) {
    case 'NOTIFICATION':
      return action.text
    default: 
      return state
  }
}

let id
export const addNotification = (text, time) => {
  return async dispatch => {
    dispatch({
      type: 'NOTIFICATION',
      text,
    })
    clearTimeout(id)
    id = setTimeout(() => {
      dispatch({
        type: 'NOTIFICATION',
        text: ''
      })
    }, time * 1000)
  }
}


export default notificationReducer