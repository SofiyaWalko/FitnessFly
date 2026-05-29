import styles from "./admintrainingcard.module.css";
import ButtonGray from "@components/ui/ButtonGray/ButtonGray";
import { useNavigate, useParams } from "react-router-dom";

import icon_kkal from "@assets/images/icon_kkal.svg";
import icon_cost from "@assets/images/icon_cost.svg";

function AdminTrainingCard({
	id,
	title,
	image,
	image_url,
	heartRate,
	heart_rate,
	calories,
	points,
	points_reward,
	time,
	duration_minutes,
	onOpen,
	onDelete,
	onRestore,
	onDeleteForever,
	onMoveUp,
	onMoveDown,
	variant = "default",
}) {
	const navigate = useNavigate();
	const { programId, day } = useParams();
	const isArchive = variant === "archive";

	const finalHeartRate = heart_rate || heartRate;
	const finalPoints = points_reward || points;
	const finalTime = duration_minutes || time;
	const finalImage = image_url || image;

	function handleEdit(e) {
		e.stopPropagation();
		navigate(`/adminpanel/training/edit/${id}`);
	}

	function handleDelete(e) {
		e.stopPropagation();
		if (onDelete) {
			onDelete(id);
		}
	}

	function handleRestore(e) {
		e.stopPropagation();
		if (onRestore) {
			onRestore(id);
		}
	}

	function handleDeleteForever(e) {
		e.stopPropagation();
		if (onDeleteForever) {
			onDeleteForever(id);
		}
	}

	return (
		<div
			className={styles.trainingcard}
			onClick={!isArchive ? onOpen : undefined}
		>
			<div className={styles.image_info}>
				<img
					className={styles.imgTraining}
					src={finalImage}
					alt={title}
				/>

				<div className={styles.name_info}>
					<div className={styles.name}>
						<h5>{title}</h5>
						<span>Пульс до {finalHeartRate}</span>
					</div>

					<div className={styles.info}>
						<div className={styles.kkal}>
							<img src={icon_kkal} alt="kkal" />
							<span>{calories} ккал</span>
						</div>

						<div className={styles.cost}>
							<img src={icon_cost} alt="cost" />
							<span>+{finalPoints}</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.time_button}>
				<div className={styles.favorite_time}>
					<span className={styles.time}>{finalTime} минут</span>
				</div>

				<div className={styles.buttonWrapper}>
					{!isArchive && (
						<div className={styles.arrow_buttons}>
							{onMoveUp && (
								<button
									className={styles.arrowBtn}
									onClick={(e) => {
										e.stopPropagation();
										onMoveUp();
									}}
								>
									↑
								</button>
							)}

							{onMoveDown && (
								<button
									className={styles.arrowBtn}
									onClick={(e) => {
										e.stopPropagation();
										onMoveDown();
									}}
								>
									↓
								</button>
							)}
						</div>
					)}
					{isArchive ? (
						<>
							<ButtonGray
								text="Восстановить"
								onClick={handleRestore}
								className={styles.primary}
							/>
							<ButtonGray
								text="Удалить навсегда"
								onClick={handleDeleteForever}
							/>
						</>
					) : (
						<>
							<ButtonGray
								text="Редактировать"
								onClick={handleEdit}
								className={styles.primary}
							/>
							<ButtonGray text="Удалить" onClick={handleDelete} />
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default AdminTrainingCard;
