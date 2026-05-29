import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddButton from "../../shared/ui/AddButton/AddButton";
import AdminTrainingCard from "../../trainings/AdminTrainingCard/AdminTrainingCard";
import Modal from "@components/Modal/Modal";
import styles from "./adminprogramday.module.css";
import AdminTrainingSelectCard from "../../trainings/AdminTrainingSelectCard/AdminTrainingSelectCard";

function AdminProgramDay() {
	const { programId, day } = useParams();
	const [program, setProgram] = useState(null);
	const [activeVideo, setActiveVideo] = useState(null);

	const [showModal, setShowModal] = useState(false);
	const [allTrainings, setAllTrainings] = useState([]);
	const [selected, setSelected] = useState([]);

	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	function fetchProgram() {
		fetch("http://fitnessfly.local/api/programs/getProgramById.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: programId }),
		})
			.then((res) => res.json())
			.then((data) => setProgram(data));
	}

	useEffect(() => {
		fetchProgram();
	}, [programId]);

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function handleDelete(trainingId) {
		setConfirmModal({
			open: true,
			title: "Удаление тренировки",
			message: "Удалить тренировку из дня программы?",
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/training/deleteTrainingFromDay.php",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							training_id: trainingId,
							program_id: programId,
							day_number: day,
						}),
					},
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setProgram((prev) => ({
								...prev,
								days: prev.days.map((d) =>
									d.day == day
										? {
												...d,
												trainings: d.trainings.filter(
													(t) => t.id !== trainingId,
												),
											}
										: d,
								),
							}));
						}
					});
			},
		});
	}

	function moveTraining(index, direction) {
		const newTrainings = [...currentDay.trainings];

		const swapIndex = index + direction;

		if (swapIndex < 0 || swapIndex >= newTrainings.length) return;

		// меняем местами
		[newTrainings[index], newTrainings[swapIndex]] = [
			newTrainings[swapIndex],
			newTrainings[index],
		];

		// обновляем локально
		setProgram((prev) => ({
			...prev,
			days: prev.days.map((d) =>
				d.day == day ? { ...d, trainings: newTrainings } : d,
			),
		}));

		// отправляем на сервер
		fetch("http://fitnessfly.local/api/training/updateOrder.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				program_id: programId,
				day_number: day,
				trainings: newTrainings.map((t, i) => ({
					id: t.id,
					order: i + 1,
				})),
			}),
		});
	}

	useEffect(() => {
		if (!showModal) return;

		fetch("http://fitnessfly.local/api/training/getAllTrainings.php")
			.then((res) => res.json())
			.then(setAllTrainings);
	}, [showModal]);

	if (!program) return <p>Загрузка...</p>;
	const currentDay = program.days?.find((d) => d.day == day);

	function toggleSelect(id) {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	}

	function handleAddSelected() {
		fetch("http://fitnessfly.local/api/training/addManyToDay.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				program_id: programId,
				day_number: day,
				training_ids: selected,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					// закрываем модалку
					setShowModal(false);

					// очищаем выбор
					setSelected([]);

					//обновляем программу
					fetchProgram();
				}
			});
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>{program.title}</h2>
				<h3>День {day}</h3>
			</div>

			<div className={styles.DayButtonWrapper}>
				<AddButton
					text="Добавить новую тренировку"
					to={`/adminpanel/programs/${programId}/day/${day}/add-training`}
				/>

				<AddButton
					text="Добавить тренировку из списка"
					onClick={() => setShowModal(true)}
				/>
			</div>

			<div className={styles.programs}>
				{currentDay?.trainings.map((training, index) => (
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
						onMoveUp={
							index > 0 ? () => moveTraining(index, -1) : null
						}
						onMoveDown={
							index < currentDay.trainings.length - 1
								? () => moveTraining(index, 1)
								: null
						}
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

			{showModal && (
				<div className={styles.modal}>
					<div className={styles.modalContentLarge}>
						<button
							className={styles.closeBtn}
							onClick={() => setShowModal(false)}
						>
							✕
						</button>

						<h3>Выберите тренировки</h3>

						<div className={styles.trainingList}>
							{allTrainings.map((t) => (
								<AdminTrainingSelectCard
									key={t.id}
									training={t}
									isSelected={selected.includes(t.id)}
									onToggle={toggleSelect}
								/>
							))}
						</div>

						<div className={styles.modalActions}>
							<button
								onClick={handleAddSelected}
								className={styles.modal_button1}
							>
								Добавить выбранные
							</button>

							<button
								onClick={() => setSelected([])}
								className={styles.modal_button2}
							>
								Очистить выбор
							</button>
						</div>
					</div>
				</div>
			)}

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
			>
				{confirmModal.message}
			</Modal>
		</>
	);
}

export default AdminProgramDay;
