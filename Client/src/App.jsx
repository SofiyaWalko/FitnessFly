import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import NonAdminRoute from "@components/NonAdminRoute";
import AdminPanel from "@components/Admin/layout/AdminPanel";
import AdminRoute from "@components/Admin/layout/AdminRoute";
import PublicRoutes from "./routes/publicRoutes";
import AuthRoutes from "./routes/authRoutes";
import HomeRoutes from "./routes/homeRoutes";
import ProgramsRoutes from "./routes/programsRoutes";
import RecipesRoutes from "./routes/recipesRoutes";
import AdminRoutes from "./routes/adminRoutes";

function App() {
	return (
		<Routes>
			{PublicRoutes()}
			{AuthRoutes()}
			{HomeRoutes()}
			{ProgramsRoutes()}
			{RecipesRoutes()}
			<Route
				path="/adminpanel"
				element={
					<AdminRoute>
						<AdminPanel />
					</AdminRoute>
				}
			>
				{AdminRoutes()}
			</Route>
		</Routes>
	);
}

export default App;
