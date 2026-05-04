import styles from "./adminreviewcard.module.css";
import star from "../../assets/images/star.svg";
import ButtonGray from "../Landing/ButtonGray";

function AdminReviewCard({ review, onPublish, onHide, onDelete }) {
	function handleDeleteClick(e) {
		e.stopPropagation();

		if (!window.confirm("Удалить отзыв?")) return;

		onDelete(review.id);
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.user}>
					<img src={review.photo} className={styles.avatar} />
					<div>
						<div className={styles.name}>{review.name}</div>
						<div className={styles.date}>{review.date}</div>
					</div>
				</div>

				<div className={styles.stars}>
					{[...Array(review.rating)].map((_, i) => (
						<img key={i} src={star} />
					))}
				</div>
			</div>

			<div className={styles.text}>{review.text}</div>

			<div className={styles.program}>Программа: {review.program}</div>

			<div className={styles.actions}>
				{review.is_published ? (
					<ButtonGray
						text="Скрыть"
						onClick={() => onHide(review.id)}
					/>
				) : (
					<ButtonGray
						text="Опубликовать"
						onClick={() => onPublish(review.id)}
						className={styles.primary}
					/>
				)}

				<ButtonGray
					text="Удалить"
					onClick={() => onDelete(review.id)}
				/>
			</div>
		</div>
	);
}

export default AdminReviewCard;
