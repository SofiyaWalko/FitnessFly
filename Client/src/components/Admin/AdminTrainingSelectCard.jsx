import styles from "./admintrainingcard.module.css";

import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";

function AdminTrainingSelectCard({ training, isSelected, onToggle }) {
	return (
		<div
			className={`${styles.trainingcard} ${
				isSelected ? styles.selected : ""
			}`}
			onClick={() => onToggle(training.id)}
		>
			<div className={styles.image_info}>
				<input
					type="checkbox"
					className={styles.checkbox}
					checked={isSelected}
					onChange={() => onToggle(training.id)}
					onClick={(e) => e.stopPropagation()}
				/>
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
							<img src={icon_kkal} />
							<span>{training.calories} ккал</span>
						</div>

						<div className={styles.cost}>
							<img src={icon_cost} />
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
			</div>
		</div>
	);
}

export default AdminTrainingSelectCard;
