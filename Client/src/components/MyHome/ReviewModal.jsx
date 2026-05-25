import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "../LitleButton";
import star from "../../assets/images/star.svg";

function ReviewModal({ program, onClose, onSuccess }) {
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [text, setText] = useState("");

	const MAX_LENGTH = 600;

	function submitReview() {
		const user_id = localStorage.getItem("user_id");

		if (!rating) {
			alert("Поставьте оценку");
			return;
		}

		if (text.length < 10) {
			alert("Отзыв слишком короткий");
			return;
		}

		if (text.length > MAX_LENGTH) {
			alert("Слишком длинный отзыв");
			return;
		}

		fetch("http://fitnessfly.local/api/reviews/createReview.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				user_id,
				program_id: program.id,
				rating,
				message: text,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					onSuccess();
				} else {
					alert(data.message);
				}
			});
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h2>Мой отзыв на программу: "{program.title}"</h2>

				<div className={styles.item_container}>
					<p>На сколько звёзд вы оцениваете программу?</p>

					<div className={styles.stars}>
						{[1, 2, 3, 4, 5].map((starValue) => (
							<img
								key={starValue}
								src={star}
								className={
									(hover || rating) >= starValue
										? `${styles.star} ${styles.starActive}`
										: styles.star
								}
								onClick={() => setRating(starValue)}
								onMouseEnter={() => setHover(starValue)}
								onMouseLeave={() => setHover(0)}
							/>
						))}
					</div>
				</div>

				<div className={styles.item_container}>
					<p>Что Вы можете сказать о программе?</p>

					<textarea
						className={styles.textarea}
						placeholder="Ваш отзыв..."
						value={text}
						maxLength={MAX_LENGTH}
						onChange={(e) => setText(e.target.value)}
					/>

					<div
						className={
							text.length > MAX_LENGTH - 50
								? `${styles.counter} ${styles.counterWarning}`
								: styles.counter
						}
					>
						{text.length} / {MAX_LENGTH}
					</div>
				</div>

				<div className={styles.buttons}>
					<LitleButton onClick={submitReview}>Отправить</LitleButton>
					<LitleButton variant="outline" onClick={onClose}>Закрыть</LitleButton>
				</div>
			</div>
		</div>
	);
}

export default ReviewModal;
