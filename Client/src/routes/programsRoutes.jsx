import { Route } from "react-router-dom";
import Programs from "@/pages/programs/Programs";
import Program from "@/pages/programs/Program";
import MainLayout from "@/components/layout/MainLayout/MainLayout";
import NonAdminRoute from "@components/NonAdminRoute";

export default function ProgramsRoutes() {
	return [
		<Route
			key="/programs"
			path="/programs"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Programs />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
		<Route
			key="/program/:id"
			path="/program/:id"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Program />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
	];
}
