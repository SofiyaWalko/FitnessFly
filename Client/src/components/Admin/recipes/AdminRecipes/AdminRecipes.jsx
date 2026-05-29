import { useEffect, useState } from "react";
import AdminRecipeCard from "../AdminRecipeCard/AdminRecipeCard";
import AddButton from "../../shared/ui/AddButton/AddButton";
import AdminPageTitle from "../../shared/ui/AdminPageTitle/AdminPageTitle";
import AdminTabs from "../../shared/ui/AdminTabs/AdminTabs";
import Modal from "@components/Modal/Modal";

import styles from "./adminrecipes.module.css";

function AdminRecipes() {
	const [recipes, setRecipes] = useState([]);
	const [activeTab, setActiveTab] = useState("Все");
	const tabs = ["Все", "Завтраки", "Обеды", "Ужины", "Десерты"];
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	const filteredRecipes =
		activeTab === "Все"
			? recipes
			: recipes.filter((r) => r.category === activeTab);

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

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function handleDelete(id) {
		setConfirmModal({
			open: true,
			title: "Архивация рецепта",
			message: "Отправить рецепт в архив?",
			onConfirm: () => {
				closeConfirmModal();

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
							setRecipes((prev) =>
								prev.filter((r) => r.id !== id),
							);
						}
					});
			},
		});
	}

	return (
		<>
			<AdminPageTitle title="Рецепты" />

			<AddButton text="Добавить рецепт" to="/adminpanel/recipes/create" />

			<AdminTabs
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			<div className={styles.recipes}>
				{filteredRecipes.map((recipe) => (
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

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
			>
				{confirmModal.message}
			</Modal>
		</>
	);
}

export default AdminRecipes;
