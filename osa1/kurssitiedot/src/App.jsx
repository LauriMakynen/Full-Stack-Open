//Kurssin nimi täältä
const Header = ({ course}) => {
  return <h1>{course}</h1>
}

// Luodaan Part osa 1.2 osiota varten
const Part = ({name, exercises}) => {
  return (
    <p>
      {name} {exercises}
    </p>
  )
}
//Header, kurssitiedoille. Nämä haetaan App komponentissa siten. 
//Toteutettu 1.2 kohdan mukainen refakrorointi. 
const Content = ({part1, exercises1, part2, exercises2, part3, exercises3 }) =>{
  return(
    <div>
      <Part name={part1} exercises={exercises1}/>
      <Part name={part2} exercises={exercises2}/>
      <Part name={part3} exercises={exercises3}/>
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