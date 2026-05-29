import { useEffect, useState } from "react";
import AdminTrainingCard from "../AdminTrainingCard/AdminTrainingCard";
import AddButton from "../../shared/ui/AddButton/AddButton";
import AdminPageTitle from "../../shared/ui/AdminPageTitle/AdminPageTitle";
import Modal from "@components/Modal/Modal";

import styles from "./admintrainings.module.css";

function AdminTrainings() {
	const [trainings, setTrainings] = useState([]);
	const [activeVideo, setActiveVideo] = useState(null);
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

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

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

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
					setInfoModal({
						open: true,
						title: "Ошибка",
						message:
							"Тренировка используется и не может быть архивирована",
					});
					return;
				}

				//если НЕ используется → confirm
				setConfirmModal({
					open: true,
					title: "Архивация тренировки",
					message: "Отправить тренировку в архив?",
					onConfirm: () => {
						closeConfirmModal();

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
					},
				});
			});
	}

	return (
		<>
			<AdminPageTitle title="Тренировки" />

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

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
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

export default AdminTrainings;
