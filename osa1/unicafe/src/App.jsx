import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad}) => {
const all = good + neutral + bad
if (all ===0)
  return(
  <div> 
    no feedback given
  </div>)

 const average = (good - bad) / all
 const positive = (good / all)

return(
  <div>
  <div> all {all}</div>
  <div> average {average}</div>
  <div> positive {positive}</div>
  </div>
)
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral +1)} text="neutral" />   
      <Button onClick={() => setBad(bad +1)} text="bad" />
        
    <h2>statistics</h2>
    <div> good {good}</div>
    <div> neutral {neutral}</div>
    <div> bad {bad}</div>
    <h2>statistics</h2>
    <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App