 const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
  }

  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => (
          <Part key={part.id} part={part} /> 
        ))}
      </div>
    )
  }

  const Part = ({ part }) => (
    <p>
      {part.name} {part.exercises}
    </p>
  )

  const Total = ({ course }) => {
    const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <p> <strong>Total number of exercises: {totalExercises}</strong></p>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
    )
  }

export default Course