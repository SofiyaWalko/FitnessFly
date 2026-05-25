import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import AdminProgramCard from "./AdminProgramCard";
import AddButton from "./AddButton";

import styles from "./adminpanel.module.css";

function AdminPrograms() {
	const [programs, setPrograms] = useState([]);
	const [activeTab, setActiveTab] = useState("Все");

	const tabs = ["Все", "Всё тело", "Ноги и ягодицы", "Пресс", "Руки и спина"];

	useEffect(() => {
		fetch("http://fitnessfly.local/api/programs/adminGetPrograms.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => res.json())
			.then((data) => setPrograms(data));
	}, []);

	function handleDelete(id) {
		if (!window.confirm("Отправить программу в архив?")) return;

		fetch("http://fitnessfly.local/api/programs/archiveProgram.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setPrograms((prev) => prev.filter((p) => p.id !== id));
				}
			});
	}

	/* ======================
	   ФИЛЬТР
	====================== */
	const filteredPrograms =
		activeTab === "Все"
			? programs
			: programs.filter((p) => p.category === activeTab);

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Программы тренировок</h2>
				<div className={styles.buttons}>
					<LogoutButton />
				</div>
			</div>

			<AddButton
				text="Добавить программу"
				to="/adminpanel/programs/create"
			/>

			{/*ТАБЫ */}
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

			{/*КАРТОЧКИ */}
			<div className={styles.programs}>
				{filteredPrograms.map((program) => (
					<AdminProgramCard
						key={program.id}
						id={program.id}
						title={program.title}
						days={program.duration_days}
						level={program.difficulty_level}
						image={program.image_url}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</>
	);
}

export default AdminPrograms;
