import { Navigate } from "react-router-dom";

function NonAdminRoute({ children }) {
	const role = localStorage.getItem("role");

	if (role === "1") {
		return <Navigate to="/adminpanel" />;
	}

	return children;
}

export default NonAdminRoute;
