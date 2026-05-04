import { Link } from "react-router-dom";
import styles from "./programcard.module.css";
import icon_calender from "../../assets/images/icon_calender.svg";
import icon_level from "../../assets/images/icon_level.svg";
import Status_Category from "../Status_Category";
import ButtonGray from "../Landing/ButtonGray";

function ProgramCompletedCard({
	id,
	title,
	days,
	level,
	image,
	status,
	hasReview,
	onReviewClick,
}) {
	return (
		<div className={styles.container}>
			
			{/* КАРТОЧКА */}
			<Link className={styles.linkProgram} to={`/program/${id}`}>
				{status && (
					<Status_Category text={status} color="#f3f3f3" />
				)}

				<img
					className={styles.imgProgram}
					src={image}
					alt={title}
				/>

				<div className={styles.info}>
					<div className={styles.calender}>
						<img src={icon_calender} alt="days" />
						<span>{days} дней</span>
					</div>

					<div className={styles.level}>
						<img src={icon_level} alt="level" />
						<span>{level}</span>
					</div>
				</div>

				<h4>{title}</h4>
			</Link>

			{/* КНОПКА */}
			{!hasReview && (
				<div
					className={styles.reviewButton}
					onClick={(e) => e.stopPropagation()}
				>
					<ButtonGray
						text="Оставить отзыв"
						onClick={() => onReviewClick(id)}
					/>
				</div>
			)}
		</div>
	);
}

export default ProgramCompletedCard;