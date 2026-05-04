import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Programs from "./pages/Programs";
import Program from "./pages/Program";
import ProgramsStarted from "./pages/ProgramsStarted";
import ProgramsCompleted from "./pages/ProgramsCompledet";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
import RecipesCategory from "./pages/RecipesCategory";
import FavoriteRecipes from "./pages/FavoriteRecipes";
import FavoriteTraining from "./pages/FavoriteTraining";
import Page404 from "./pages/Page404";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyHome from "./pages/MyHome";
import AdminPanel from "./components/Admin/AdminPanel";
import AdminRoute from "./components/Admin/AdminRoute";
import AdminPrograms from "./components/Admin/AdminPrograms";
import AdminRecipes from "./components/Admin/AdminRecipes";
import AdminReviews from "./components/Admin/AdminReviews";
import AdminCreateRecipe from "./components/Admin/AdminCreateRecipe";
import AdminProgramDetails from "./components/Admin/AdminProgramDetails";
import AdminProgramDay from "./components/Admin/AdminProgramDay";
import AdminCreateProgram from "./components/Admin/AdminCreateProgram";
import AdminAddTrainingToDay from "./components/Admin/AdminAddTrainingToDay";
import AdminCreateTraining from "./components/Admin/AdminCreateTraining";
import AdminTrainings from "./components/Admin/AdminTrainings";
import Archive from "./components/Admin/Archive";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Landing />} />

			<Route
				path="/home"
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			>
				<Route index element={<MyHome />} />
				<Route path="programs-started" element={<ProgramsStarted />} />
				<Route
					path="programs-completed"
					element={<ProgramsCompleted />}
				/>
				<Route
					path="favorite-training"
					element={<FavoriteTraining />}
				/>
				<Route path="favorite-recipes" element={<FavoriteRecipes />} />
			</Route>

			<Route path="/programs" element={<Programs />} />
			<Route path="/program/:id" element={<Program />} />

			<Route path="/recipes" element={<Recipes />} />
			<Route path="/recipe/:id" element={<Recipe />} />
			{/* <Route path="/recipes/category/:id" element={<RecipesCategory />} /> */}

			<Route path="/404" element={<Page404 />} />

			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			<Route
				path="/adminpanel"
				element={
					<AdminRoute>
						<AdminPanel />
					</AdminRoute>
				}
			>
				<Route index element={<div>Выберите раздел</div>} />

				<Route path="programs" element={<AdminPrograms />} />
				<Route path="recipes" element={<AdminRecipes />} />
				<Route path="reviews" element={<AdminReviews />} />
				<Route path="trainings" element={<AdminTrainings />} />
				<Route path="archive" element={<Archive />} />

				{/* RECIPES */}
				<Route path="recipes/create" element={<AdminCreateRecipe />} />
				<Route
					path="recipes/edit/:id"
					element={<AdminCreateRecipe />}
				/>

				{/* PROGRAMS */}
				<Route
					path="programs/create"
					element={<AdminCreateProgram />}
				/>
				<Route
					path="programs/edit/:id"
					element={<AdminCreateProgram />}
				/>				

				<Route
					path="programs/:programId/day/:day"
					element={<AdminProgramDay />}
				/>

				<Route path="programs/:id" element={<AdminProgramDetails />} />

				<Route
					path="programs/:programId/day/:day/add-training"
					element={<AdminCreateTraining />}
				/>
				<Route
					path="training/edit/:id"
					element={<AdminCreateTraining />}
				/>


			</Route>
		</Routes>
	);
}

export default App;
