import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton";
import AdminTrainingCard from "./AdminTrainingCard";
import AddButton from "./AddButton";

import styles from "./adminpanel.module.css";

function AdminTrainings() {
	const [trainings, setTrainings] = useState([]);
	const [activeVideo, setActiveVideo] = useState(null);

	/* ======================
	   ЗАГРУЗКА ТРЕНИРОВОК
	====================== */
	function fetchTrainings() {
		fetch("http://fitnessfly.local/api/training/getAllTrainings.php")
			.then((res) => res.json())
			.then(setTrainings);
	}

	useEffect(() => {
		fetchTrainings();
	}, []);

	/* ======================
	   УДАЛЕНИЕ (В АРХИВ)
	====================== */
	function handleDelete(trainingId) {
		//сначала проверка
		fetch("http://fitnessfly.local/api/training/checkTrainingUsage.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: trainingId }),
		})
			.then((res) => res.json())
			.then((data) => {
				//если используется
				if (data.used) {
					alert(
						`Тренировка используется и не может быть архивирована`,
					);
					return;
				}

				//если НЕ используется → confirm
				if (!window.confirm("Отправить тренировку в архив?")) return;

				//архивируем
				fetch(
					"http://fitnessfly.local/api/training/archiveTraining.php",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id: trainingId }),
					},
				)
					.then((res) => res.json())
					.then((resData) => {
						if (resData.success) {
							setTrainings((prev) =>
								prev.filter((t) => t.id !== trainingId),
							);
						}
					});
			});
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Тренировки</h2>
				<div className={styles.buttons}>
					<LogoutButton />
				</div>
			</div>			

			<div className={styles.trainings}>
				{trainings.map((training) => (
					<AdminTrainingCard
						key={training.id}
						id={training.id}
						title={training.title}
						image={training.image_url}
						time={training.duration_minutes}
						calories={training.calories}
						points={training.points_reward}
						heartRate={training.heart_rate}
						video_url={training.video_url}
						onOpen={() => setActiveVideo(training)}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</>
	);
}

export default AdminTrainings;
