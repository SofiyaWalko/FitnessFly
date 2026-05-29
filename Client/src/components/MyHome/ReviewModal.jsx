import { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./goalform.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";
import star from "@assets/images/star.svg";

function ReviewModal({ program, onClose, onSuccess }) {
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(0);
	const [text, setText] = useState("");
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	const MAX_LENGTH = 600;

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

	function submitReview() {
		const user_id = localStorage.getItem("user_id");

		if (!rating) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Поставьте оценку",
			});
			return;
		}

		if (text.length < 10) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Отзыв слишком короткий",
			});
			return;
		}

		if (text.length > MAX_LENGTH) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Слишком длинный отзыв",
			});
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
					setInfoModal({
						open: true,
						title: "Ошибка",
						message: data.message,
					});
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
					<LitleButton variant="outline" onClick={onClose}>
						Закрыть
					</LitleButton>
				</div>
			</div>

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</div>
	);
}

export default ReviewModal;
