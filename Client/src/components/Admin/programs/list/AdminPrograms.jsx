import { useEffect, useState } from "react";
import AdminProgramCard from "../cards/AdminProgramCard";
import AddButton from "../../shared/ui/AddButton/AddButton";
import AdminPageTitle from "../../shared/ui/AdminPageTitle/AdminPageTitle";
import Modal from "@components/Modal/Modal";

import styles from "./adminprograms.module.css";

function AdminPrograms() {
	const [programs, setPrograms] = useState([]);
	const [activeTab, setActiveTab] = useState("Все");
	const tabs = ["Все", "Всё тело", "Ноги и ягодицы", "Пресс", "Руки и спина"];
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	useEffect(() => {
		fetch("http://fitnessfly.local/api/programs/adminGetPrograms.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		})
			.then((res) => res.json())
			.then((data) => setPrograms(data));
	}, []);

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function handleDelete(id) {
		setConfirmModal({
			open: true,
			title: "Архивация программы",
			message: "Отправить программу в архив?",
			onConfirm: () => {
				closeConfirmModal();

				fetch(
					"http://fitnessfly.local/api/programs/archiveProgram.php",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id }),
					},
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setPrograms((prev) =>
								prev.filter((p) => p.id !== id),
							);
						}
					});
			},
		});
	}

	/* ======================
	   ФИЛЬТР
	====================== */
	const filteredPrograms =
		activeTab === "Все"
			? programs
			: programs.filter((p) => p.category === activeTab);

	return (
		<>
			<AdminPageTitle title="Программы тренировок" />

			<AddButton
				text="Добавить программу"
				to="/adminpanel/programs/create"
			/>

			{/*ТАБЫ */}
			<div className={styles.tabs}>
				{tabs.map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={
							activeTab === tab
								? `${styles.tab} ${styles.active}`
								: styles.tab
						}
					>
						{tab}
					</button>
				))}
			</div>

			{/*КАРТОЧКИ */}
			<div className={styles.programs}>
				{filteredPrograms.map((program) => (
					<AdminProgramCard
						key={program.id}
						id={program.id}
						title={program.title}
						days={program.duration_days}
						level={program.difficulty_level}
						image={program.image_url}
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

export default AdminPrograms;
