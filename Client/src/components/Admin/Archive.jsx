import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";

import AdminTrainingArchiveCard from "./AdminTrainingArchiveCard";
import AdminProgramArchiveCard from "./AdminProgramArchiveCard";
import AdminRecipeArchiveCard from "./AdminRecipeArchiveCard";

import styles from "./adminpanel.module.css";

function Archive() {
	const [activeTab, setActiveTab] = useState("trainings");

	const [trainings, setTrainings] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [recipes, setRecipes] = useState([]);

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
		if (!window.confirm("Удалить тренировку навсегда?")) return;

		fetch("http://fitnessfly.local/api/archive/deleteTrainingForever.php", {
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
		if (!window.confirm("Удалить программу навсегда?")) return;

		fetch("http://fitnessfly.local/api/archive/deleteProgramForever.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(() => {
			setPrograms((prev) => prev.filter((p) => p.id !== id));
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
		if (!window.confirm("Удалить рецепт навсегда?")) return;

		fetch("http://fitnessfly.local/api/archive/deleteRecipeForever.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(() => {
			setRecipes((prev) => prev.filter((r) => r.id !== id));
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

			{/* ТАБЫ */}
			<div className={styles.tabs}>
				<button
					className={
						activeTab === "trainings"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => setActiveTab("trainings")}
				>
					Тренировки
				</button>

				<button
					className={
						activeTab === "programs" ? styles.activeTab : styles.tab
					}
					onClick={() => setActiveTab("programs")}
				>
					Программы
				</button>

				<button
					className={
						activeTab === "recipes" ? styles.activeTab : styles.tab
					}
					onClick={() => setActiveTab("recipes")}
				>
					Рецепты
				</button>
			</div>

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
							<AdminTrainingArchiveCard
								key={t.id}
								training={t}
								onRestore={handleRestoreTraining}
								onDeleteForever={handleDeleteTraining}
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
							<AdminProgramArchiveCard
								key={p.id}
								program={p}
								onRestore={handleRestoreProgram}
								onDeleteForever={handleDeleteProgram}
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
							<AdminRecipeArchiveCard
								key={r.id}
								recipe={r}
								onRestore={handleRestoreRecipe}
								onDeleteForever={handleDeleteRecipe}
							/>
						))
					)}
				</div>
			)}
		</>
	);
}

export default Archive;
