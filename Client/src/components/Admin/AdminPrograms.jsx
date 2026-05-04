import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import AdminProgramCard from "./AdminProgramCard";
import AddButton from "./AddButton";

import styles from "./adminpanel.module.css";

function AdminPrograms() {
	const [programs, setPrograms] = useState([]);

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

			<div className={styles.programs}>
				{programs.map((program) => (
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
