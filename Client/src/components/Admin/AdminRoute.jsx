import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

	const role = localStorage.getItem("role");

	if (!role || role !== "1") {
		return <Navigate to="/home" />;
	}

	return children;
}

export default AdminRoute;