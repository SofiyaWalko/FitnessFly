import { useEffect, useState } from "react";

import styles from "./favoritetraining.module.css";
import NotificationsButton from "@/components/NotificationButton/NotificationsButton";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import TrainingCard from "@components/Training/TrainingCard";

function FavoriteTraining() {
	const [trainings, setTrainings] = useState([]);
	const [activeVideo, setActiveVideo] = useState(null);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getFavoriteTrainings.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setTrainings(data);
			});
	}, []);

	function removeCard(id) {
		setTrainings((prev) => prev.filter((t) => t.id !== id));
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Любимые тренировки</h2>

				<div className={styles.buttons}>
					<NotificationsButton />
					<LogoutButton />
				</div>
			</div>

			<div className={styles.trainings}>
				{trainings.map((training) => (
					<TrainingCard
						key={training.id}
						id={training.id}
						title={training.title}
						calories={training.calories}
						time={training.time}
						points={training.points}
						heartRate={training.heartRate}
						image={training.image}
						removeCard={removeCard}
						isFavoriteInitial={true}
						completed={true}
						video_url={training.video_url}
						onOpen={() => setActiveVideo(training)}
					/>
				))}
			</div>

			{activeVideo && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<video src={activeVideo.video_url} autoPlay controls />

						<button
							className={styles.closeBtn}
							onClick={() => setActiveVideo(null)}
						>
							✕
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default FavoriteTraining;
