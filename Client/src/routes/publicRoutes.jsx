import { Route } from "react-router-dom";
import Landing from "@/pages/landing/Landing";
import Page404 from "@/pages/errors/Page404";
import MainLayout from "@/components/layout/MainLayout/MainLayout";
import NonAdminRoute from "@components/NonAdminRoute";

export default function PublicRoutes() {
	return [
		<Route
			key="/"
			path="/"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Landing />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
		<Route
			key="/404"
			path="/404"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Page404 />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
	];
}
