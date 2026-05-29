import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AdminReviewCard from "./AdminReviewCard";
import AdminPageTitle from "../shared/ui/AdminPageTitle/AdminPageTitle";
import AdminTabs from "../shared/ui/AdminTabs/AdminTabs";
import Modal from "@components/Modal/Modal";

import styles from "./adminreviews.module.css";

function AdminReviews() {
	const [reviews, setReviews] = useState([]);
	const [activeTab, setActiveTab] = useState("all");
	const { setNewReviewsCount } = useOutletContext();
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

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

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

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
		setConfirmModal({
			open: true,
			title: "Удаление отзыва",
			message: "Удалить отзыв навсегда?",
			onConfirm: () => {
				closeConfirmModal();

				fetch("http://fitnessfly.local/api/reviews/deleteReview.php", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id }),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setReviews((prev) =>
								prev.filter((r) => r.id !== id),
							);
						}
					});
			},
		});
	}

	return (
		<>
			<AdminPageTitle title="Отзывы" />

			<AdminTabs
				tabs={[
					{ label: "Все", value: "all" },
					{ label: "Опубликованные", value: "published" },
					{ label: "Не опубликованные", value: "hidden" },
				]}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

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

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
			>
				{confirmModal.message}
			</Modal>
		</>
	);
}

export default AdminReviews;
