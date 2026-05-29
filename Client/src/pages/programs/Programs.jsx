import { useEffect, useState } from "react";
import ProgramCard from "@components/Programs/components/ProgramCard";
import styles from "./programs.module.css";

function Programs() {
	const [programs, setPrograms] = useState([]);
	const [activeTab, setActiveTab] = useState("Все");

	const tabs = ["Все", "Всё тело", "Ноги и ягодицы", "Пресс", "Руки и спина"];

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/programs/getPrograms.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setPrograms(data);
			});
	}, []);

	/* ======================
	   ФИЛЬТР
	====================== */
	const filteredPrograms =
		activeTab === "Все"
			? programs
			: programs.filter((p) => p.category === activeTab);

	return (
		<div className={styles.container}>
			<div className={styles.programspage}>
				<h2 className={styles.title}>Программы тренировок</h2>
			</div>

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
			<div className={styles.programs_cards}>
				{filteredPrograms.map((program) => (
					<ProgramCard
						key={program.id}
						id={program.id}
						title={program.title}
						days={program.duration_days}
						level={program.difficulty_level}
						image={program.image_url}
						status={program.status}
					/>
				))}
			</div>
		</div>
	);
}

export default Programs;
