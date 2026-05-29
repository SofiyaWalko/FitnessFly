import { Route } from "react-router-dom";
import Home from "@/pages/home/Home";
import MyHome from "@/pages/home/MyHome";
import ProgramsStarted from "@/pages/programs/ProgramsStarted";
import ProgramsCompleted from "@/pages/programs/ProgramsCompledet";
import FavoriteTraining from "@/pages/favorite/FavoriteTraining";
import FavoriteRecipes from "@/pages/favorite/FavoriteRecipes";
import MainLayout from "@/components/layout/MainLayout/MainLayout";

export default function HomeRoutes() {
	return (
		<Route
			path="/home"
			element={
				<MainLayout>
					<Home />
				</MainLayout>
			}
		>
			<Route index element={<MyHome />} />
			<Route path="programs-started" element={<ProgramsStarted />} />
			<Route path="programs-completed" element={<ProgramsCompleted />} />
			<Route path="favorite-training" element={<FavoriteTraining />} />
			<Route path="favorite-recipes" element={<FavoriteRecipes />} />
		</Route>
	);
}
