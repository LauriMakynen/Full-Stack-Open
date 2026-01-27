//Kurssin nimi täältä
const Header = ({ course}) => {
  return <h1>{course}</h1>
}
//Header, kurssitiedoille. Nämä haetaan App komponentissa siten. 
const Content = ({part1, exercises1, part2, exercises2, part3, exercises3 }) =>{
  return(
    <div>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
    </div>
  )
}
//Luodaan total, joka viedään App komponenttiin
const Total = ({total}) => {
  return <p> Number of exercises {total} </p>
}

//Korjattu App komponentti, joka hakee Header, Content ja Total komponentteihin tallenntetut tiedot. 

const App = () => {
  const course = 'Half Stack application development'

  const part1 = 'Fundamentals of React'
  const exercises1 = 10

  const part2 = 'Using props to pass data'
  const exercises2 = 7

  const part3 = 'State of a component'
  const exercises3 = 14

  const total = exercises1 + exercises2 +exercises3
  return (
    <div>
      <Header course={course} />
      <Content 
      part1={part1}
      exercises1={exercises1}

      part2={part2}
      exercises2={exercises2}

      part3={part3}
      exercises3={exercises3}
      />
      <Total total={total}/>
    </div>
  )
}


export default App