import { useState } from "react";

import styles from "./trainingcard.module.css";
import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";
import favorite_none from "../../assets/images/favorite_none.svg";
import favorite_active from "../../assets/images/favorite_active.svg";
import Status_Category from "../Status_Category";

function TrainingCard({
	id,
	title,
	calories,
	time,
	points,
	heartRate,
	image,
	onOpen,
	completed,
	isFavoriteInitial = false,
	removeCard,
}) {
	const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
	const user_id = localStorage.getItem("user_id");

	function toggleFavorite(e) {
		e.stopPropagation();

		const user_id = localStorage.getItem("user_id");

		if (!user_id) {
			alert(
				"Добавлять тренировки могут только авторизованные пользователи",
			);
			return;
		}

		if (isFavorite) {
			fetch(
				"http://fitnessfly.local/api/training/removeFavoriteTraining.php",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_id,
						training_id: id,
					}),
				},
			)
				.then((res) => res.json())
				.then(() => {
					setIsFavorite(false);

					if (removeCard) {
						removeCard(id);
					}
				});
		} else {
			fetch(
				"http://fitnessfly.local/api/training/addFavoriteTraining.php",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						user_id,
						training_id: id,
					}),
				},
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.success) {
						setIsFavorite(true);
					} else {
						alert(data.message);
					}
				});
		}
	}

	return (
		<div className={styles.trainingcard} onClick={onOpen}>
			{user_id && completed === true && (
				<Status_Category text="Выполнено" color="#ffffff" />
			)}

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
							<span>
								{completed
									? `${points} получено`
									: `+${points}`}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.favorite_time}>
				<img
					className={styles.favorite}
					src={isFavorite ? favorite_active : favorite_none}
					onClick={toggleFavorite}
					alt="heart"
				/>
				<span className={styles.time}>{time} минут</span>
			</div>
		</div>
	);
}

export default TrainingCard;
