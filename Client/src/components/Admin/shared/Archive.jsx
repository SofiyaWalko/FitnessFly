import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import Modal from "@components/Modal/Modal";

import AdminTrainingCard from "../trainings/AdminTrainingCard/AdminTrainingCard";
import AdminProgramCard from "../programs/cards/AdminProgramCard";
import AdminRecipeCard from "../recipes/AdminRecipeCard/AdminRecipeCard";
import AdminTabs from "./ui/AdminTabs/AdminTabs";

import styles from "../layout/adminpanel.module.css";

function Archive() {
	const [activeTab, setActiveTab] = useState("trainings");

	const [trainings, setTrainings] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [recipes, setRecipes] = useState([]);

	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	/* ======================
	   ЗАГРУЗКА
	====================== */

	function fetchArchivedTrainings() {
		fetch("http://fitnessfly.local/api/archive/getArchivedTrainings.php")
			.then((res) => res.json())
			.then(setTrainings);
	}

	function fetchArchivedPrograms() {
		fetch("http://fitnessfly.local/api/archive/getArchivedPrograms.php")
			.then((res) => res.json())
			.then(setPrograms);
	}

	function fetchArchivedRecipes() {
		fetch("http://fitnessfly.local/api/archive/getArchivedRecipes.php")
			.then((res) => res.json())
			.then(setRecipes);
	}

	useEffect(() => {
		if (activeTab === "trainings") {
			fetchArchivedTrainings();
		}

		if (activeTab === "programs") {
			fetchArchivedPrograms();
		}

		if (activeTab === "recipes") {
			fetchArchivedRecipes();
		}
	}, [activeTab]);

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	/* ======================
	   TRAININGS
	====================== */

	function handleRestoreTraining(id) {
		fetch("http://fitnessfly.local/api/archive/restoreTraining.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setTrainings((prev) => prev.filter((t) => t.id !== id));
				}
			});
	}

	function handleDeleteTraining(id) {
		setConfirmModal({
			open: true,
			title: "Удаление тренировки",
			message: "Удалить тренировку навсегда?",
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/archive/deleteTrainingForever.php",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id }),
					},
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setTrainings((prev) =>
								prev.filter((t) => t.id !== id),
							);
						}
					});
			},
		});
	}

	/* ======================
	   PROGRAMS
	====================== */

	function handleRestoreProgram(id) {
		fetch("http://fitnessfly.local/api/archive/restoreProgram.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(() => {
			setPrograms((prev) => prev.filter((p) => p.id !== id));
		});
	}

	function handleDeleteProgram(id) {
		setConfirmModal({
			open: true,
			title: "Удаление программы",
			message: "Удалить программу навсегда?",
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/archive/deleteProgramForever.php",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id }),
					},
				).then(() => {
					setPrograms((prev) => prev.filter((p) => p.id !== id));
				});
			},
		});
	}

	function handleRestoreRecipe(id) {
		fetch("http://fitnessfly.local/api/archive/restoreRecipe.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(() => {
			setRecipes((prev) => prev.filter((r) => r.id !== id));
		});
	}

	function handleDeleteRecipe(id) {
		setConfirmModal({
			open: true,
			title: "Удаление рецепта",
			message: "Удалить рецепт навсегда?",
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/archive/deleteRecipeForever.php",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ id }),
					},
				).then(() => {
					setRecipes((prev) => prev.filter((r) => r.id !== id));
				});
			},
		});
	}

	/* ======================
	   UI
	====================== */

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Архив</h2>
				<div className={styles.buttons}>
					<LogoutButton />
				</div>
			</div>

			<AdminTabs
				tabs={[
					{ label: "Тренировки", value: "trainings" },
					{ label: "Программы", value: "programs" },
					{ label: "Рецепты", value: "recipes" },
				]}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{/* ======================
			   КОНТЕНТ
			====================== */}

			{/* ТРЕНИРОВКИ */}
			{activeTab === "trainings" && (
				<div className={styles.trainings}>
					{trainings.length === 0 ? (
						<div className={styles.empty}>
							Нет архивированных тренировок
						</div>
					) : (
						trainings.map((t) => (
							<AdminTrainingCard
								key={t.id}
								id={t.id}
								title={t.title}
								image_url={t.image_url}
								heart_rate={t.heart_rate}
								calories={t.calories}
								points_reward={t.points_reward}
								duration_minutes={t.duration_minutes}
								onRestore={handleRestoreTraining}
								onDeleteForever={handleDeleteTraining}
								variant="archive"
							/>
						))
					)}
				</div>
			)}

			{/* ПРОГРАММЫ */}
			{activeTab === "programs" && (
				<div className={styles.programs}>
					{programs.length === 0 ? (
						<div className={styles.empty}>
							Нет архивированных программ
						</div>
					) : (
						programs.map((p) => (
							<AdminProgramCard
								key={p.id}
								id={p.id}
								title={p.title}
								duration_days={p.duration_days}
								difficulty_level={p.difficulty_level}
								image_url={p.image_url}
								onRestore={handleRestoreProgram}
								onDeleteForever={handleDeleteProgram}
								variant="archive"
							/>
						))
					)}
				</div>
			)}

			{/* РЕЦЕПТЫ */}
			{activeTab === "recipes" && (
				<div className={styles.recipes}>
					{recipes.length === 0 ? (
						<div className={styles.empty}>
							Нет архивированных рецептов
						</div>
					) : (
						recipes.map((r) => (
							<AdminRecipeCard
								key={r.id}
								id={r.id}
								title={r.title}
								category={r.category}
								points={r.points}
								image={r.image}
								calories={r.calories}
								onRestore={handleRestoreRecipe}
								onDeleteForever={handleDeleteRecipe}
								variant="archive"
							/>
						))
					)}
				</div>
			)}

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

export default Archive;
