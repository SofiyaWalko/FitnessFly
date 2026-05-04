import styles from "./admintrainingcard.module.css";
import ButtonGray from "../Landing/ButtonGray";

import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";

function AdminTrainingArchiveCard({ training, onRestore, onDeleteForever }) {
	function handleRestore(e) {
		e.stopPropagation();
		onRestore(training.id);
	}

	function handleDelete(e) {
		e.stopPropagation();
		onDeleteForever(training.id);
	}

	return (
		<div className={styles.trainingcard}>
			<div className={styles.image_info}>
				<img
					className={styles.imgTraining}
					src={training.image_url}
					alt={training.title}
				/>

				<div className={styles.name_info}>
					<div className={styles.name}>
						<h5>{training.title}</h5>
						<span>Пульс до {training.heart_rate}</span>
					</div>

					<div className={styles.info}>
						<div className={styles.kkal}>
							<img src={icon_kkal} alt="kkal" />
							<span>{training.calories} ккал</span>
						</div>

						<div className={styles.cost}>
							<img src={icon_cost} alt="cost" />
							<span>+{training.points_reward}</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.time_button}>
				<div className={styles.favorite_time}>
					<span className={styles.time}>
						{training.duration_minutes} минут
					</span>
				</div>

				<div className={styles.buttonWrapper}>
					<ButtonGray
						text="Восстановить"
						onClick={handleRestore}
						className={styles.primary}
					/>
					<ButtonGray
						text="Удалить навсегда"
						onClick={handleDelete}
					/>
				</div>
			</div>
		</div>
	);
}

export default AdminTrainingArchiveCard;
