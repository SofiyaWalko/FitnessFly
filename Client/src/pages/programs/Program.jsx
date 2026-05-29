import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Modal from "@components/Modal/Modal";

import styles from "./program.module.css";
import icon_calender from "@assets/images/icon_calender.svg";
import icon_level from "@assets/images/icon_level.svg";
import icon_check from "@assets/images/check.svg";
import TrainingCard from "@components/Training/TrainingCard";

function Program() {
	const { id } = useParams();

	const [program, setProgram] = useState(null);
	const [activeDay, setActiveDay] = useState(1);
	const [activeVideo, setActiveVideo] = useState(null);

	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	const videoRef = useRef(null);
	const lastTime = useRef(0);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/programs/getProgramById.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id, user_id }),
		})
			.then((res) => res.json())
			.then((data) => setProgram(data));
	}, [id]);

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

	if (!program) return <div>Загрузка...</div>;
	const isStarted = program.current_day !== null;

	const currentDayNumber = program.current_day ?? 0;

	const currentDay = program?.days?.find((d) => d.day === activeDay);

	function startProgram() {
		const user_id = localStorage.getItem("user_id");
		if (!user_id) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Для начала программы необходимо зарегистрироваться",
			});
			return;
		}

		fetch("http://fitnessfly.local/api/programs/startProgram.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id,
				program_id: program.id,
			}),
		}).then(() => window.location.reload());
	}

	function handleProgress(e) {
		const video = e.target;

		if (video.currentTime > lastTime.current + 1) {
			video.currentTime = lastTime.current;
		}

		lastTime.current = video.currentTime;
	}

	function handleComplete() {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/training/completeTraining.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				training_id: activeVideo.id,
				user_id,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("SERVER RESPONSE:", data);

				if (!data.success) {
					setInfoModal({
						open: true,
						title: "Ошибка",
						message: "Ошибка при сохранении",
					});
					return;
				}

				setInfoModal({
					open: true,
					title: "Успешно",
					message: `Тренировка завершена! Вам начислено ${data.points_added} Fitcoins`,
				});

				//ОБНОВЛЯЕМ И current_day И completed
				setProgram((prev) => ({
					...prev,
					current_day: data.new_current_day,

					days: prev.days.map((day) => {
						const updatedTrainings = day.trainings.map((t) =>
							t.id === activeVideo.id
								? { ...t, completed: true }
								: t,
						);

						const allCompleted = updatedTrainings.every(
							(t) => t.completed,
						);

						return {
							...day,
							trainings: updatedTrainings,
							isCompleted: allCompleted,
						};
					}),
				}));

				setActiveVideo(null);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	return (
		<>
			<div className={styles.container}>
				<div className={styles.header}>
					<img
						className={styles.image}
						src={program.image_url}
						alt="Изображение программы"
					/>

					<div className={styles.info}>
						<h2>{program.title}</h2>
						<p className={styles.description}>
							{program.description}
						</p>

						<div className={styles.meta}>
							<div className={styles.calender}>
								<img src={icon_calender} alt="days" />
								<span>{program.duration_days} дней</span>
							</div>

							<div className={styles.level}>
								<img src={icon_level} alt="level" />
								<span>{program.difficulty_level}</span>
							</div>
						</div>

						{!isStarted && (
							<button
								className={styles.startBtn}
								onClick={startProgram}
							>
								Начать программу
							</button>
						)}
					</div>
				</div>

				{/* ДНИ */}
				<div className={styles.days}>
					{program?.days?.map((day) => {
						const isLocked = day.day > currentDayNumber;

						return (
							<button
								key={day.day}
								className={
									activeDay === day.day
										? styles.activeDay
										: styles.day
								}
								onClick={() => {
									//программа не начата
									if (!isStarted) {
										setInfoModal({
											open: true,
											title: "Информация",
											message:
												"Сначала начните программу",
										});
										return;
									}

									if (isLocked) {
										setInfoModal({
											open: true,
											title: "Информация",
											message:
												"Сначала завершите текущий день",
										});
										return;
									}

									setActiveDay(day.day);
								}}
							>
								{day.isCompleted ? (
									<>
										<img src={icon_check} alt="done" />
										День {day.day}
									</>
								) : (
									<>День {day.day}</>
								)}
							</button>
						);
					})}
				</div>

				{/* ТРЕНИРОВКИ */}
				<div className={styles.trainings}>
					<h3>День {activeDay}</h3>

					{currentDay?.trainings?.map((training, index) => {
						const isLocked = activeDay > currentDayNumber;

						const prevTraining = currentDay.trainings[index - 1];

						const isLockedByOrder =
							index > 0 && !prevTraining?.completed;

						return (
							<TrainingCard
								key={training.id}
								id={training.id}
								title={training.title}
								calories={training.calories}
								time={training.duration_minutes}
								points={training.points_reward}
								heartRate={training.heart_rate}
								image={training.image_url}
								isFavoriteInitial={training.isFavorite}
								completed={training.completed}
								onOpen={() => {
									//программа не начата
									if (!isStarted) {
										setInfoModal({
											open: true,
											title: "Информация",
											message:
												"Сначала начните программу",
										});
										return;
									}

									//день заблокирован
									if (isLocked) {
										setInfoModal({
											open: true,
											title: "Информация",
											message:
												"Сначала завершите предыдущий день",
										});
										return;
									}

									if (isLockedByOrder) {
										setInfoModal({
											open: true,
											title: "Информация",
											message:
												"Сначала выполните предыдущую тренировку",
										});
										return;
									}

									setActiveVideo(training);
								}}
							/>
						);
					})}
				</div>

				{/* ВИДЕО */}
				{activeVideo && (
					<div className={styles.modal}>
						<div className={styles.modalContent}>
							<video
								ref={videoRef}
								src={activeVideo.video_url}
								autoPlay
								controls
								onTimeUpdate={handleProgress}
								onEnded={handleComplete}
							/>

							<button
								className={styles.closeBtn}
								onClick={() => setActiveVideo(null)}
							>
								✕
							</button>
						</div>
					</div>
				)}
			</div>

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

export default Program;
