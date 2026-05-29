import { useEffect, useState } from "react";

import RecipeCard from "@components/Recipes/components/RecipeCard";
import styles from "./recipes.module.css";

function Recipes() {
	const [recipes, setRecipes] = useState([]);
	const [activeTab, setActiveTab] = useState("Все");
	const tabs = ["Все", "Завтраки", "Обеды", "Ужины", "Десерты"];

	const filteredRecipes =
		activeTab === "Все"
			? recipes
			: recipes.filter((r) => r.category === activeTab);

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
		<div className={styles.container}>
			<div className={styles.recipespage}>
				<h2 className={styles.title}>Рецепты</h2>
			</div>

			<div className={styles.tabs}>
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={
							activeTab === tab
								? `${styles.tab} ${styles.active}`
								: styles.tab
						}
					>
						{tab}
					</button>
				))}
			</div>

			<div className={styles.recipes_cards}>
				{filteredRecipes.map((recipe) => (
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
	);
}

export default Recipes;
