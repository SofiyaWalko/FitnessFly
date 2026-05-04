import styles from "./admintrainingcard.module.css";
import ButtonGray from "../Landing/ButtonGray";
import { useNavigate, useParams } from "react-router-dom";

import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";

function AdminTrainingCard({
	id,
	title,
	image,
	heartRate,
	calories,
	points,
	time,
	onOpen,
	onDelete,
	onMoveUp,
	onMoveDown,
}) {
	const navigate = useNavigate();
	const { programId, day } = useParams();

	function handleEdit(e) {
		e.stopPropagation();
		navigate(`/adminpanel/training/edit/${id}`);
	}

	function handleDelete(e) {
		e.stopPropagation();

		onDelete(id);
	}

	return (
		<div className={styles.trainingcard} onClick={onOpen}>
			<div className={styles.image_info}>
				<img className={styles.imgTraining} src={image} alt={title} />

				<div className={styles.name_info}>
					<div className={styles.name}>
						<h5>{title}</h5>
						<span>Пульс до {heartRate}</span>
					</div>

					<div className={styles.info}>
						<div className={styles.kkal}>
							<img src={icon_kkal} alt="kkal" />
							<span>{calories} ккал</span>
						</div>

						<div className={styles.cost}>
							<img src={icon_cost} alt="cost" />
							<span>+{points}</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.time_button}>
				<div className={styles.favorite_time}>
					<span className={styles.time}>{time} минут</span>
				</div>

				<div className={styles.buttonWrapper}>
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
					<ButtonGray
						text="Редактировать"
						onClick={handleEdit}
						className={styles.primary}
					/>
					<ButtonGray text="Удалить" onClick={handleDelete} />
				</div>
			</div>
		</div>
	);
}

export default AdminTrainingCard;
