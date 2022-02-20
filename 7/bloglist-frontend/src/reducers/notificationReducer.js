/* eslint-disable indent */
const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'NOTIFICATION':
      return action.data
    default:
      return state
  }
}

let id
export const addNotification = (text, error, time) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFICATION',
      data: { text, error },
    })
    clearTimeout(id)
    id = setTimeout(() => {
      dispatch({
        type: 'NOTIFICATION',
        data: '',
      })
    }, time * 1000)
  }
}

export default notificationReducer
