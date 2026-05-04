import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./adminpanel.module.css";

function AdminAddTrainingToDay() {
	const { programId, day } = useParams();
	const navigate = useNavigate();

	const [trainings, setTrainings] = useState([]);

	useEffect(() => {
		fetch("http://fitnessfly.local/api/training/getAllTrainings.php")
			.then((res) => res.json())
			.then(setTrainings);
	}, []);

	function handleAdd(trainingId) {
		fetch("http://fitnessfly.local/api/training/addTrainingToDay.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				program_id: programId,
				day_number: day,
				training_id: trainingId,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate(-1);
				}
			});
	}

	return (
		<div className={styles.programs}>
			{trainings.map((t) => (
				<div
					key={t.id}
					className={styles.card}
					onClick={() => handleAdd(t.id)}
				>
					<img src={t.image} alt={t.title} />
					<h4>{t.title}</h4>
				</div>
			))}
		</div>
	);
}

export default AdminAddTrainingToDay;