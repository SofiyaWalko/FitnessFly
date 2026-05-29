import { Route } from "react-router-dom";
import Recipes from "@/pages/recipes/Recipes";
import Recipe from "@/pages/recipes/Recipe";
import MainLayout from "@/components/layout/MainLayout/MainLayout";
import NonAdminRoute from "@components/NonAdminRoute";

export default function RecipesRoutes() {
	return [
		<Route
			key="/recipes"
			path="/recipes"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Recipes />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
		<Route
			key="/recipe/:id"
			path="/recipe/:id"
			element={
				<NonAdminRoute>
					<MainLayout>
						<Recipe />
					</MainLayout>
				</NonAdminRoute>
			}
		/>,
	];
}
