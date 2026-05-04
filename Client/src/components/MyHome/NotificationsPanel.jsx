import { useEffect, useState } from "react";
import styles from "./notificationspanel.module.css";
import NotificationItem from "./NotificationItem";
import closeIcon from "../../assets/images/exit.svg"

function NotificationsPanel({ onClose, onRead }) {
	const [notifications, setNotifications] = useState([]);

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
	}, []);

	return (
		<div className={styles.overlay}>
			<div className={styles.panel}>
				<div className={styles.header}>
					<h3>Центр уведомлений</h3>
					<button className={styles.close} onClick={onClose}><img src={closeIcon} /></button>
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
