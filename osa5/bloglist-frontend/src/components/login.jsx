
//Login-komponentti, joka renderöi lomakkeen, jossa on kentät käyttäjätunnukselle ja salasanalle,
// sekä kirjautumispainikkeen. Lomake saa propsina funktiot, jotka käsittelevät lomakkeen lähettämistä
//  ja kenttien muutoksia, sekä kenttien arvot.
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm