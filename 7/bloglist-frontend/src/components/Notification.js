import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => notification)
  if (notification === '') {
    return null
  } else {
    if (notification.error) {
      return <div className="error">{notification.text}</div>
    } else {
      return <div className="success">{notification.text}</div>
    }
  }
}

export default Notification
