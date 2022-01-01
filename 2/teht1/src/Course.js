import React from 'react'

const Course = ({ course }) => {
    const { name } = course
    return (
      <div>
        <Header name={name} />
        <Content course={course} />
        <Total parts={course.parts} />
      </div>
    )
  }
  
  const Header = ({name}) => {
    return (
      <div>
        <h1>{name}</h1>
      </div>
    )
  }
  
  const Content = ({course}) => {
    return (
      <div>
        {course.parts.map(part => 
        <Part key={part.id} text={part.name} exercises={part.exercises} />
        )}
      </div>
    )
  }
  
  const Part = ({text, exercises}) => {
    return (
      <div>
        <p>{text} {exercises}</p>
      </div>
    )
  }
  
  const Total = ({parts}) => {
    const total = parts.map(part => part.exercises).reduce((s, part) => part + s);
    return (
      <div>
        <p>Total of {total} exercises</p>
      </div>
    )
  }

export default Course