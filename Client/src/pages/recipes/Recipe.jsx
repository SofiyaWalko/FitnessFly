import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "@components/Modal/Modal";

import styles from "./recipe.module.css";

function Recipe() {
	const { id } = useParams();
	const [recipe, setRecipe] = useState(null);
	const [checkedIngredients, setCheckedIngredients] = useState({});

	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	useEffect(() => {
		fetch("http://fitnessfly.local/api/recipes/getRecipeById.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
				user_id: localStorage.getItem("user_id"),
			}),
		})
			.then((res) => res.json())
			.then((data) => setRecipe(data));
	}, [id]);

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

	if (!recipe) return <div>Загрузка...</div>;
	if (!recipe.hasAccess) {
		return (
			<>
				<div className={styles.container}>
					<div className={styles.locked}>
						<h2>{recipe.title}</h2>

						<p>Этот рецепт нужно разблокировать</p>

						<button
							className={styles.unlockBtn}
							onClick={handleBuy}
						>
							Разблокировать за {recipe.points} FitCoins
						</button>
					</div>
				</div>
			</>
		);
	}

	function handleBuy() {
		const user_id = localStorage.getItem("user_id");

		if (!user_id) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Авторизуйтесь для покупки",
			});
			return;
		}

		setConfirmModal({
			open: true,
			title: "Разблокировка рецепта",
			message: `Разблокировать рецепт за ${recipe.points} FitCoins?`,
			onConfirm: () => {
				closeConfirmModal();

				fetch("http://fitnessfly.local/api/recipes/buyRecipe.php", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_id,
						recipe_id: recipe.id,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setInfoModal({
								open: true,
								title: "Успешно",
								message: "Рецепт разблокирован",
							});

							setRecipe((prev) => ({
								...prev,
								hasAccess: true,
							}));
						} else {
							setInfoModal({
								open: true,
								title: "Ошибка",
								message: data.message,
							});
						}
					});
			},
		});
	}

	function toggleIngredient(index) {
		setCheckedIngredients((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.header}>
					<img
						className={styles.image}
						src={recipe.image}
						alt={recipe.title}
					/>

					<div className={styles.info}>
						<h2>{recipe.title}</h2>

						<span className={styles.category}>
							{recipe.category}
						</span>

						<div className={styles.description}>
							<p>{recipe.description}</p>
						</div>
					</div>
				</div>

				<h3>Приготовление</h3>

				<div className={styles.recipeLayout}>
					{/* ЛЕВАЯ КОЛОНКА — ШАГИ */}
					<div className={styles.steps}>
						{recipe.steps?.map((step) => (
							<div
								key={step.step_number}
								className={styles.stepCard}
							>
								{step.image_url && (
									<img
										src={step.image_url}
										className={styles.stepImage}
									/>
								)}

								<div className={styles.step_text}>
									<div className={styles.stepNumber}>
										Шаг {step.step_number}
									</div>

									<p className={styles.stepText}>
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* ПРАВАЯ КОЛОНКА — ИНГРЕДИЕНТЫ */}
					<div className={styles.ingredientsSticky}>
						<h3>Ингредиенты</h3>

						<ul className={styles.ingredientsList}>
							{recipe.ingredients.map((item, index) => (
								<li
									key={index}
									className={`${styles.ingredientItem} ${
										checkedIngredients[index]
											? styles.checked
											: ""
									}`}
									onClick={() => toggleIngredient(index)}
								>
									<input
										type="checkbox"
										checked={!!checkedIngredients[index]}
										onChange={() => toggleIngredient(index)}
										onClick={(e) => e.stopPropagation()}
									/>

									<span>
										{item.name} — {item.quantity}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
			>
				{confirmModal.message}
			</Modal>

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</>
	);
}

export default Recipe;
