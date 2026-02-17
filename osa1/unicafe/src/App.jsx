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
  //Tämä lisättiin vahingossa... 
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  //Random anecdootin valitsija. 
  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [selected, setSelected] = useState(0)

  return (
    <div>
      {anecdotes[selected]}
      <Button onClick={nextAnecdote} text="Next Anecdote" />
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