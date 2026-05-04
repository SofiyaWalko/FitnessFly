import { useEffect, useState } from "react";
import styles from "./favoriteRecipes.module.css";
import NotificationsButton from "../components/NotificationsButton";
import LogoutButton from "../components/LogoutButton";
import RecipeCard from "../components/Recipes/RecipeCard";

function FavoriteRecipes() {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getFavoriteRecipes.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setRecipes(data);
			});
	}, []);

	function removeCard(id) {
		setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Любимые рецепты</h2>

				<div className={styles.buttons}>
					<NotificationsButton />
					<LogoutButton />
				</div>
			</div>

			<div className={styles.recipes}>
				{recipes.map((recipe) => (
					<RecipeCard
						key={recipe.id}
						id={recipe.id}
						title={recipe.title}
						category={recipe.category}
						points={recipe.points}
						image={recipe.image}
						removeCard={removeCard}
						isFavoriteInitial={true}
						isPurchased={recipe.isPurchased}
					/>
				))}
			</div>
		</>
	);
}

export default FavoriteRecipes;
