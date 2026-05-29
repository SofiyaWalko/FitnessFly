import { useEffect, useState } from "react";
import styles from "./programsstarted.module.css";
import NotificationsButton from "@/components/NotificationButton/NotificationsButton";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import ProgramCard from "@components/Programs/components/ProgramCard";

function ProgramsStarted() {
	const [programs, setPrograms] = useState([]);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getStartedPrograms.php", {
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

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Начатые программы</h2>

				<div className={styles.buttons}>
					<NotificationsButton />
					<LogoutButton />
				</div>
			</div>

			<div className={styles.programs}>
				{programs.map((program) => (
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
		</>
	);
}

export default ProgramsStarted;
