import { useEffect, useState } from "react";
import styles from "./notificationspanel.module.css";
import NotificationItem from "./NotificationItem";
import Modal from "@/components/Modal/Modal";
import closeIcon from "@assets/images/exit.svg";
import { API_BASE } from "@/config";

function NotificationsPanel({ onClose, onRead }) {
	const [notifications, setNotifications] = useState([]);
	const [type, setType] = useState(null);
	const [telegramStatus, setTelegramStatus] = useState(null);
	const [connectLink, setConnectLink] = useState("");
	const [confirmModal, setConfirmModal] = useState({
		open: false,
		title: "",
		message: "",
		onConfirm: null,
	});

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch(
			`${API_BASE}/notifications/getNotifications.php`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then(setNotifications);

		// помечаем как прочитанные
		fetch(`${API_BASE}/notifications/markAsRead.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		}).then(() => onRead()); // сброс бейджа

		fetch(
			`${API_BASE}/notifications/getNotificationType.php`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then((data) => setType(data.type));

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
	}, []);

	function closeConfirmModal() {
		setConfirmModal({
			open: false,
			title: "",
			message: "",
			onConfirm: null,
		});
	}

	function changeType() {
		if (!type) return;

		const newType = type === "email" ? "telegram" : "email";
		const nextLabel = newType === "email" ? "Email" : "Телеграм-бот";

		setConfirmModal({
			open: true,
			title: "Смена способа уведомлений",
			message: `Сменить способ уведомлений на ${nextLabel}?`,
			onConfirm: () => {
				const type_id = newType === "email" ? 1 : 2;

				fetch(
					`${API_BASE}/notifications/changeNotificationType.php`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							user_id: localStorage.getItem("user_id"),
							type_id,
						}),
					},
				).then(() => {
					setType(newType);
					closeConfirmModal();
				});
			},
		});
	}

	function handleConfirmChange() {
		confirmModal.onConfirm?.();
	}

	function handleCloseConfirm() {
		closeConfirmModal();
	}

	return (
		<>
			<div className={styles.overlay}>
				<div className={styles.panel}>
					<div className={styles.header}>
						<h3>Центр уведомлений</h3>
						<button className={styles.close} onClick={onClose}>
							<img src={closeIcon} />
						</button>
					</div>

					<div className={styles.notificationType}>
						<div>
							<p className={styles.typeLabel}>
								Способ получения уведомлений
							</p>
							<p className={styles.typeValue}>
								{type === "email" ? "Email" : "Телеграм-бот"}
							</p>
						</div>

						<button
							onClick={changeType}
							className={styles.changeBtn}
						>
							Изменить
						</button>
					</div>

					<div className={styles.list}>
						{notifications.length === 0 ? (
							<div className={styles.empty}>
								Уведомлений пока нет
							</div>
						) : (
							notifications.map((n) => (
								<NotificationItem key={n.id} notification={n} />
							))
						)}
					</div>
				</div>
			</div>

			<Modal
				open={confirmModal.open}
				title={confirmModal.title}
				onClose={handleCloseConfirm}
				variant="confirm"
				onConfirm={handleConfirmChange}
			>
				{confirmModal.message}
			</Modal>
		</>
	);
}

export default NotificationsPanel;
