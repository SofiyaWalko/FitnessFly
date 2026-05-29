import { Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AuthLayout from "@/components/layout/AuthLayout/AuthLayout";

export default function AuthRoutes() {
	return [
		<Route
			key="/login"
			path="/login"
			element={
				<AuthLayout>
					<Login />
				</AuthLayout>
			}
		/>,
		<Route
			key="/register"
			path="/register"
			element={
				<AuthLayout>
					<Register />
				</AuthLayout>
			}
		/>,
	];
}
