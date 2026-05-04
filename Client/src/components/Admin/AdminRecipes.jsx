import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import AdminRecipeCard from "./AdminRecipeCard";
import AddButton from "./AddButton";

import styles from "./adminpanel.module.css";

function AdminRecipes() {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		fetch("http://fitnessfly.local/api/recipes/getRecipes.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => res.json())
			.then((data) => {
				setRecipes(data);
			});
	}, []);

function handleDelete(id) {
	if (!window.confirm("Отправить рецепт в архив?")) return;

	fetch("http://fitnessfly.local/api/recipes/archiveRecipe.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ id }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.success) {
				setRecipes((prev) => prev.filter((r) => r.id !== id));
			}
		});
}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Рецепты</h2>
				<div className={styles.buttons}>
					<LogoutButton />
				</div>
			</div>

			<AddButton text="Добавить рецепт" to="/adminpanel/recipes/create" />

			<div className={styles.recipes}>
				{recipes.map((recipe) => (
					<AdminRecipeCard
						key={recipe.id}
						id={recipe.id}
						title={recipe.title}
						category={recipe.category}
						points={recipe.points}
						calories={recipe.calories}
						image={recipe.image}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</>
	);
}

export default AdminRecipes;
