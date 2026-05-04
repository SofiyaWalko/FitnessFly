import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {

  const user = localStorage.getItem("user_id")

  if (!user) {
    return <Navigate to="/login"/>
  }

  return children
}

export default ProtectedRoute