import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddButton from "./AddButton";
import styles from "./adminpanel.module.css";

function AdminProgramDetails() {
	const { id } = useParams();
	const [program, setProgram] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch("http://fitnessfly.local/api/programs/getProgramById.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => setProgram(data));
	}, [id]);

	if (!program) return <p>Загрузка...</p>;

	function handleAddDay() {
		fetch("http://fitnessfly.local/api/programs/createProgramDay.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ program_id: id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					// обновляем список дней
					setProgram((prev) => ({
						...prev,
						days: [
							...prev.days,
							{
								day: data.day_number,
								trainings: [],
							},
						],
					}));
				}
			});
	}

	function handleDeleteDay(dayNumber) {
		if (!window.confirm("Удалить день?")) return;

		fetch("http://fitnessfly.local/api/programs/deleteProgramDay.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				program_id: id,
				day_number: dayNumber,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setProgram((prev) => ({
						...prev,
						days: prev.days.filter((d) => d.day !== dayNumber),
					}));
				}
			});
	}

	function handleNotify() {
		if (
			!window.confirm(
				`Оповестить пользователей о программе "${program.title}"?`,
			)
		)
			return;

		fetch(
			"http://fitnessfly.local/api/notifications/createNotification.php",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: "Новая программа",
					message: `Добавлена новая программа тренировок "${program.title}"`,
				}),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					alert("Уведомление отправлено");
				}
			});
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>{program.title}</h2>
			</div>

			<div className={styles.qwik_actions}>
				<div onClick={handleAddDay}>
					<AddButton text="Добавить день" />
				</div>

				<button className={styles.notifyBtn} onClick={handleNotify}>
					Оповестить пользователей
				</button>
			</div>

			<div className={styles.days}>
				{program.days.map((day) => (
					<div
						key={day.day}
						className={styles.card}
						onClick={() =>
							navigate(
								`/adminpanel/programs/${id}/day/${day.day}`,
							)
						}
					>
						<div className={styles.dayNumber}>День {day.day}</div>

						<button
							className={styles.deleteBtn}
							onClick={(e) => {
								e.stopPropagation();
								handleDeleteDay(day.day);
							}}
						>
							✕
						</button>
					</div>
				))}
			</div>
		</>
	);
}

export default AdminProgramDetails;
