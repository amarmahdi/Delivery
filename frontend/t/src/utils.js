let tokenCheck = {}

tokenCheck.authenticated = () => {
  if (localStorage.getItem('token')) {
    return true
  } else {
    return false
  }
}

export default tokenCheck
