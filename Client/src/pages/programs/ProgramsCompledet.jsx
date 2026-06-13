import { useEffect, useState } from "react";
import styles from "./programscompleted.module.css";
import NotificationsButton from "@/components/NotificationButton/NotificationsButton";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import ProgramCompletedCard from "@components/Programs/components/ProgramCompletedCard";
import ReviewModal from "@components/MyHome/Review/ReviewModal";

function ProgramsCompleted() {
	const [programs, setPrograms] = useState([]);
	const [reviewProgram, setReviewProgram] = useState(null);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/getCompletedPrograms.php", {
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
				<h2 className={styles.title}>Завершённые программы</h2>

				<div className={styles.buttons}>
					<NotificationsButton />
					<LogoutButton />
				</div>
			</div>

			<div className={styles.programs}>
				{programs.map((program) => (
					<ProgramCompletedCard
						key={program.id}
						id={program.id}
						title={program.title}
						days={program.duration_days}
						level={program.difficulty_level}
						image={program.image_url}
						status={program.status}
						hasReview={program.hasReview}
						onReviewClick={(id) => {
							const selected = programs.find((p) => p.id === id);
							setReviewProgram(selected);
						}}
					/>
				))}
			</div>

			{reviewProgram && (
				<ReviewModal
					program={reviewProgram}
					onClose={() => setReviewProgram(null)}
					onSuccess={() => {
						setReviewProgram(null);

						// обновим список
						setPrograms((prev) =>
							prev.map((p) =>
								p.id === reviewProgram.id
									? { ...p, hasReview: true }
									: p,
							),
						);
					}}
				/>
			)}
		</>
	);
}

export default ProgramsCompleted;
