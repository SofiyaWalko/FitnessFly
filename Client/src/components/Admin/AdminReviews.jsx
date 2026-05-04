import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import AdminReviewCard from "./AdminReviewCard";

import styles from "./adminreviews.module.css";

function AdminReviews() {
	const [reviews, setReviews] = useState([]);
	const [activeTab, setActiveTab] = useState("all");
	const { setNewReviewsCount } = useOutletContext();

	useEffect(() => {
		setNewReviewsCount(0);
	}, []);

	function fetchReviews() {
		fetch("http://fitnessfly.local/api/reviews/getReviewsAdmin.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ filter: activeTab }),
		})
			.then((res) => res.json())
			.then(setReviews);
	}

	useEffect(() => {
		fetchReviews();
	}, [activeTab]);

	function handlePublish(id) {
		fetch("http://fitnessfly.local/api/reviews/publishReview.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(fetchReviews);
	}

	function handleHide(id) {
		fetch("http://fitnessfly.local/api/reviews/hideReview.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		}).then(fetchReviews);
	}

	function handleDelete(id) {
		if (!window.confirm("Удалить отзыв навсегда?")) return;

		fetch("http://fitnessfly.local/api/reviews/deleteReview.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setReviews((prev) => prev.filter((r) => r.id !== id));
				}
			});
	}

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Отзывы</h2>
				<div className={styles.buttons}>
					<LogoutButton />
				</div>
			</div>

			{/* ТАБЫ */}
			<div className={styles.tabs}>
				<button
					className={
						activeTab === "all" ? styles.activeTab : styles.tab
					}
					onClick={() => setActiveTab("all")}
				>
					Все
				</button>

				<button
					className={
						activeTab === "published"
							? styles.activeTab
							: styles.tab
					}
					onClick={() => setActiveTab("published")}
				>
					Опубликованные
				</button>

				<button
					className={
						activeTab === "hidden" ? styles.activeTab : styles.tab
					}
					onClick={() => setActiveTab("hidden")}
				>
					Не опубликованные
				</button>
			</div>

			{/* СПИСОК */}
			<div className={styles.reviews}>
				{reviews.map((r) => (
					<AdminReviewCard
						key={r.id}
						review={r}
						onPublish={handlePublish}
						onHide={handleHide}
						onDelete={handleDelete}
					/>
				))}
			</div>
		</>
	);
}

export default AdminReviews;
