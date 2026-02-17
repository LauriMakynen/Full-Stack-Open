import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>
//Taulukko 1.11
const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td> 
  </tr>
)

const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad

  if (all === 0) {
    return <div>no feedback given</div>
  }

  const average = ((props.good - props.bad) / all).toFixed(2)
  const positive = ((props.good / all) * 100).toFixed(2)
  //Taulukko elementit 1.11 mukaisesti. 
  return (
    <table>
      <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>

      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />

      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App