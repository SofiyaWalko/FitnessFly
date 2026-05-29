import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AddButton from "../../shared/ui/AddButton/AddButton";
import Modal from "@components/Modal/Modal";
import styles from "./adminprogramdetails.module.css";

function AdminProgramDetails() {
	const { id } = useParams();
	const [program, setProgram] = useState(null);
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
	});
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});
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

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
		});
	}

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

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
		setConfirmModal({
			open: true,
			title: "Удаление дня",
			message: "Удалить день?",
		});

		setConfirmModal((prev) => ({
			...prev,
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/programs/deleteProgramDay.php",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							program_id: id,
							day_number: dayNumber,
						}),
					},
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setProgram((prevProgram) => ({
								...prevProgram,
								days: prevProgram.days.filter(
									(d) => d.day !== dayNumber,
								),
							}));
						}
					});
			},
		}));
	}

	function handleNotify() {
		setConfirmModal({
			open: true,
			title: "Отправка уведомления",
			message: `Оповестить пользователей о программе "${program.title}"?`,
		});

		setConfirmModal((prev) => ({
			...prev,
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/notifications/sendTelegramNotification.php",
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
							setInfoModal({
								open: true,
								title: "Уведомление отправлено",
								message: `Отправлено ${data.total_sent} пользователям:\n- Email: ${data.email_sent} (ошибок: ${data.email_error})\n- Telegram: ${data.telegram_sent} (ошибок: ${data.telegram_error})`,
							});
						} else {
							setInfoModal({
								open: true,
								title: "Ошибка",
								message: "Ошибка при отправке уведомления",
							});
						}
					});
			},
		}));
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

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={confirmModal.onConfirm}
			>
				{confirmModal.message}
			</Modal>

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</>
	);
}

export default AdminProgramDetails;
