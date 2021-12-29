import React, { useState } from 'react'

const Button = ({setValue, value, text}) => {
  return (<button onClick={() => setValue(value + 1)}> {text}</button>)
}

const StatisticLine = ({value, text}) => {
  if (text === "average") {
    return (<Average value={value} text={text} />)
  } else if (text === "positive") {
    return (<Positive value={value} text={text} />)
  } else {
    return (<Display value={value} text={text} />)
  }
}

const Display = ({value,text}) => <tr><td>{text} {value}</td></tr>

const Average = ({value,text}) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{((value[0] - value[2]) / (value[0]+value[1]+value[2])).toFixed(1)}</td>
  </tr>)
}

const Positive = ({value,text}) => {
  return (
  <tr>
    <td>{text}</td>
    <td>{(value[0] / (value[0]+value[1]+value[2]) * 100).toFixed(1)}%</td>
  </tr>)
}

const Statistics = ({good, neutral, bad}) => {
  if (good === 0 && neutral === 0 && bad === 0){
    return (<div>No feedback given</div>)
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine value={good} text="good" />
          <StatisticLine value={neutral} text="neutral" />
          <StatisticLine value={bad} text="bad" />
          <StatisticLine value={[good,neutral,bad]} text="average" />
          <StatisticLine value={[good,neutral,bad]} text="positive" />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button setValue={setGood} value={good} text="good" />
        <Button setValue={setNeutral} value={neutral} text="neutral" />
        <Button setValue={setBad} value={bad} text="bad" />
      </div>
      <div>
        <Statistics good={good} neutral={neutral} bad={bad} />
      </div>
    </div>
  )
}

export default App