
const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }
  console.log(course)

  const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }

  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
      </div>
    )
  }

  const Part = ({ part }) => {
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }

  const Total = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <p>Total number of exercises: {totalExercises}</p>
    )
  }

  return (
    <div>
      <Header course={course} /> 
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App