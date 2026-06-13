import { useEffect, useState, useRef } from "react";
import Modal from "@/components/Modal/Modal";
import styles from "./personalinfo.module.css";

import avatar from "@assets/images/photo.png";
import coinsIcon from "@assets/images/icon_cost.svg";
import changeIcon from "@assets/images/change.svg";
import telegramIcon from "@assets/images/telegram.svg";

import GoalForm from "../Goal/GoalForm";
import { API_BASE } from "@/config";

function PersonalInfo({ onUpdate }) {
	const [data, setData] = useState(null);
	const [photo, setPhoto] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [telegramStatus, setTelegramStatus] = useState(null);
	const [connectLink, setConnectLink] = useState("");

	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	const fileInput = useRef();

	function loadProfile() {
		const user_id = localStorage.getItem("user_id");

		fetch(`${API_BASE}/home/getPersonalInfo.php`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setPhoto(data.photo);
			});

		// Получаем статус Telegram
		fetch(
			`${API_BASE}/notifications/getTelegramStatus.php`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then(setTelegramStatus);

		// Получаем ссылку для подключения Telegram
		fetch(
			`${API_BASE}/notifications/getTelegramConnectLink.php`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					setConnectLink(data.connect_url);
				}
			});
	}

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

	function handleDisconnectTelegram() {
		setConfirmModal({
			open: true,
			title: "Отвязка Telegram",
			message:
				"Вы уверены, что хотите отвязать Telegram? Способ уведомлений вернется на Email.",
			onConfirm: () => {
				closeConfirmModal();

				const user_id = localStorage.getItem("user_id");

				fetch(
					`${API_BASE}/notifications/disconnectTelegram.php`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ user_id }),
					},
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.success) {
							setInfoModal({
								open: true,
								title: "Успешно",
								message: "Telegram успешно отвязан",
							});
							loadProfile();
						} else {
							setInfoModal({
								open: true,
								title: "Ошибка",
								message: "Ошибка при отвязке Telegram",
							});
						}
					});
			},
		});
	}

	useEffect(() => {
		loadProfile();
	}, []);

	function openFile() {
		fileInput.current.click();
	}

	function uploadPhoto(e) {
		const file = e.target.files[0];

		if (!file) return;

		const user_id = localStorage.getItem("user_id");

		const formData = new FormData();
		formData.append("photo", file);
		formData.append("user_id", user_id);

		fetch(`${API_BASE}/home/uploadUserPhoto.php`, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					setPhoto(res.photo);
				}
			});
	}

	function handleSuccess() {
		loadProfile();

		if (onUpdate) {
			onUpdate();
		}
	}

	if (!data) return null;

	return (
		<>
			<div className={styles.pesonal_info}>
				<div className={styles.info_header}>
					<img
						src={photo ? photo : avatar}
						alt="avatar"
						className={styles.photo}
						onClick={openFile}
					/>

					<input
						type="file"
						ref={fileInput}
						style={{ display: "none" }}
						accept="image/*"
						onChange={uploadPhoto}
					/>

					<div className={styles.name_age}>
						<span>{data.name}</span>
						<span>{data.age}</span>
					</div>
				</div>

				<div className={styles.balance}>
					<div className={styles.balance_name}>
						<span>Баланс</span>
						<span>Fitcoins</span>
					</div>

					<div className={styles.balance_count}>
						<span>{data.points}</span>
						<img src={coinsIcon} alt="balance" />
					</div>
				</div>

				<div className={styles.goal}>
					<div className={styles.goal_item}>
						<span>Цель</span>
						<span>{data.goal}</span>
					</div>
				</div>

				<div className={styles.telegram_profile_block}>
					<div className={styles.telegram_status_row}>
						<div className={styles.telegram_label_group}>
							<img
								src={telegramIcon}
								alt="Telegram"
								className={styles.telegram_icon}
							/>
							<span>Telegram</span>
						</div>
						<div className={styles.telegram_action_group}>
							{telegramStatus?.telegram_connected ? (
								<>
									<span className={styles.connected}>
										{telegramStatus.telegram_username
											? telegramStatus.telegram_username
											: `Подключён`}
									</span>
									<button
										className={
											styles.telegram_compact_disconnect_btn
										}
										onClick={handleDisconnectTelegram}
										title="Отвязать Telegram"
									>
										✕
									</button>
								</>
							) : (
								connectLink && (
									<button
										className={
											styles.telegram_compact_connect_btn
										}
										onClick={() =>
											window.open(
												connectLink,
												"_blank",
												"noopener,noreferrer",
											)
										}
									>
										Подключить
									</button>
								)
							)}
						</div>
					</div>
				</div>

				<div
					className={styles.change}
					onClick={() => setShowForm(true)}
				>
					<img src={changeIcon} alt="icon" />
					<span>Изменить цель</span>
				</div>
			</div>

			{showForm && (
				<GoalForm
					closeForm={() => setShowForm(false)}
					onSuccess={handleSuccess}
					initialGoal={data.goal}
				/>
			)}

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={closeConfirmModal}
				variant="confirm"
				onConfirm={() => confirmModal.onConfirm?.()}
			>
				{confirmModal.message}
			</Modal>

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</>
	);
}

export default PersonalInfo;
