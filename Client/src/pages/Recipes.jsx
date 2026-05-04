import { useEffect, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCard from "../components/Recipes/RecipeCard";
import styles from "./recipes.module.css";

function Recipes() {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/recipes/getRecipes.php", {
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

	return (
		<>
			<Header />

			<div className={styles.container}>
				<div className={styles.recipespage}>
					<h2 className={styles.title}>Рецепты</h2>
				</div>

				<div className={styles.recipes_cards}>
					{recipes.map((recipe) => (
						<RecipeCard
							key={recipe.id}
							id={recipe.id}
							title={recipe.title}
							category={recipe.category}
							points={recipe.points}
							calories={recipe.calories}
							image={recipe.image}
							isFavoriteInitial={recipe.isFavorite}
							isPurchased={recipe.isPurchased}
						/>
					))}
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Recipes;