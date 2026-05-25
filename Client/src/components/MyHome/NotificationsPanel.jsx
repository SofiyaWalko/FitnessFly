import { useEffect, useState } from "react";
import styles from "./notificationspanel.module.css";
import NotificationItem from "./NotificationItem";
import closeIcon from "../../assets/images/exit.svg";

function NotificationsPanel({ onClose, onRead }) {
	const [notifications, setNotifications] = useState([]);
	const [type, setType] = useState(null);

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch(
			"http://fitnessfly.local/api/notifications/getNotifications.php",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then(setNotifications);

		// помечаем как прочитанные
		fetch("http://fitnessfly.local/api/notifications/markAsRead.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		}).then(() => onRead()); // сброс бейджа

		fetch(
			"http://fitnessfly.local/api/notifications/getNotificationType.php",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user_id }),
			},
		)
			.then((res) => res.json())
			.then((data) => setType(data.type));
	}, []);

	function changeType() {
		const newType = type === "email" ? "telegram" : "email";

		const confirmChange = confirm(
			`Сменить способ уведомлений на ${
				newType === "email" ? "Email" : "Telegram-бот"
			}?`,
		);

		if (!confirmChange) return;

		const type_id = newType === "email" ? 1 : 2;

		fetch(
			"http://fitnessfly.local/api/notifications/changeNotificationType.php",
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
		});
	}

	return (
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

					<button onClick={changeType} className={styles.changeBtn}>
						Изменить
					</button>
				</div>

				<div className={styles.list}>
					{notifications.length === 0 ? (
						<div className={styles.empty}>Уведомлений пока нет</div>
					) : (
						notifications.map((n) => (
							<NotificationItem key={n.id} notification={n} />
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default NotificationsPanel;
