import { Route } from "react-router-dom";
import AdminPrograms from "@components/Admin/programs/list/AdminPrograms";
import AdminRecipes from "@components/Admin/recipes/AdminRecipes/AdminRecipes";
import AdminReviews from "@components/Admin/reviews/AdminReviews";
import AdminCreateRecipe from "@components/Admin/recipes/AdminCreateRecipe/AdminCreateRecipe";
import AdminProgramDetails from "@components/Admin/programs/details/AdminProgramDetails";
import AdminProgramDay from "@components/Admin/programs/day/AdminProgramDay";
import AdminCreateProgram from "@components/Admin/programs/create/AdminCreateProgram";
import AdminAddTrainingToDay from "@components/Admin/programs/actions/AdminAddTrainingToDay";
import AdminCreateTraining from "@components/Admin/trainings/AdminCreateTraining/AdminCreateTraining";
import AdminTrainings from "@components/Admin/trainings/AdminTrainings/AdminTrainings";
import Archive from "@components/Admin/shared/Archive";

export default function AdminRoutes() {
	return [
		<Route key="index" index element={<div>Выберите раздел</div>} />,

		<Route key="programs" path="programs" element={<AdminPrograms />} />,
		<Route key="recipes" path="recipes" element={<AdminRecipes />} />,
		<Route key="reviews" path="reviews" element={<AdminReviews />} />,
		<Route key="trainings" path="trainings" element={<AdminTrainings />} />,
		<Route key="archive" path="archive" element={<Archive />} />,

		<Route
			key="recipes-create"
			path="recipes/create"
			element={<AdminCreateRecipe />}
		/>,
		<Route
			key="recipes-edit"
			path="recipes/edit/:id"
			element={<AdminCreateRecipe />}
		/>,

		<Route
			key="programs-create"
			path="programs/create"
			element={<AdminCreateProgram />}
		/>,
		<Route
			key="programs-edit"
			path="programs/edit/:id"
			element={<AdminCreateProgram />}
		/>,

		<Route
			key="programs-day"
			path="programs/:programId/day/:day"
			element={<AdminProgramDay />}
		/>,
		<Route
			key="programs-id"
			path="programs/:id"
			element={<AdminProgramDetails />}
		/>,

		<Route
			key="programs-add-training"
			path="programs/:programId/day/:day/add-training"
			element={<AdminCreateTraining />}
		/>,
		<Route
			key="training-edit"
			path="training/edit/:id"
			element={<AdminCreateTraining />}
		/>,
	];
}
