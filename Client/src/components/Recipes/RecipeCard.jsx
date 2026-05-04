import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./recipecard.module.css";
import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";
import favorite_none from "../../assets/images/favorite_none.svg";
import favorite_active from "../../assets/images/favorite_active.svg";

import ButtonGray from "../Landing/ButtonGray";
import Status_Category from "../Status_Category";

function RecipeCard({
	id,
	title,
	category,
	points,
	calories,
	image,
	removeCard,
	isFavoriteInitial = false,
	isPurchased = false,
}) {

	const navigate = useNavigate();

	const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
	const [purchased, setPurchased] = useState(isPurchased);

	/* ======================
	   ИЗБРАННОЕ
	====================== */
	function toggleFavorite(e) {

		e.preventDefault();

		const user_id = localStorage.getItem("user_id");

		if (!user_id) {
			alert("Добавлять рецепты могут только авторизованные пользователи");
			return;
		}

		if (isFavorite) {

			fetch("http://fitnessfly.local/api/recipes/removeFavoriteRecipe.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user_id,
					recipe_id: id
				})
			})
			.then(res => res.json())
			.then(() => {
				setIsFavorite(false);

				if (removeCard) {
					removeCard(id);
				}
			});

		} else {

			fetch("http://fitnessfly.local/api/recipes/addFavoriteRecipe.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					user_id,
					recipe_id: id
				})
			})
			.then(res => res.json())
			.then(() => {
				setIsFavorite(true);
			});

		}
	}

	/* ======================
	   ПОКУПКА / ПЕРЕХОД
	====================== */
	function handleClick() {

		const user_id = localStorage.getItem("user_id");

		// Бесплатный или уже куплен
		if (Number(points) === 0 || purchased) {
			navigate(`/recipe/${id}`);
			return;
		}

		
		if (!user_id) {
			alert("Авторизуйтесь для покупки");
			return;
		}

		const confirmBuy = confirm(
			`Разблокировать рецепт за ${points} FitCoins?`
		);

		if (!confirmBuy) return;

		fetch("http://fitnessfly.local/api/recipes/buyRecipe.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				user_id,
				recipe_id: id
			})
		})
		.then(res => res.json())
		.then(data => {

			if (data.success) {

				alert("Рецепт разблокирован");

				setPurchased(true); 

				navigate(`/recipe/${id}`);

			} else {
				alert(data.message);
			}

		});
	}

	return (

		<div className={styles.container}>

			<Status_Category text={category} color="#f3f3f3" />

			<img
				className={styles.favorite}
				src={isFavorite ? favorite_active : favorite_none}
				onClick={toggleFavorite}
				alt="heart"
			/>

			<img
				className={styles.imgRecipe}
				src={image}
				alt={title}
			/>

			<div className={styles.info}>

				<div className={styles.kkal}>
					<img src={icon_kkal} alt="kkal" />
					<span>{calories} </span>
				</div>

				<div className={styles.cost}>
					<img src={icon_cost} alt="cost" />
					<span>
						{Number(points) === 0 ? "Бесплатно" : points}
					</span>
				</div>

			</div>

			<h4>{title}</h4>

			<div className={styles.buttonWrapper}>

				{Number(points) === 0 || purchased ? (

					<ButtonGray
						text="Смотреть рецепт"
						to={`/recipe/${id}`}
					/>

				) : (

					<ButtonGray
						text="Разблокировать рецепт"
						onClick={handleClick}
					/>

				)}

			</div>

		</div>

	);
}

export default RecipeCard;