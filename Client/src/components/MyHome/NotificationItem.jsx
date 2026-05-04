import styles from "./notificationitem.module.css";

function NotificationItem({ notification }) {
	return (
		<div
			className={`${styles.item} ${
				!notification.is_read ? styles.unread : ""
			}`}
		>
			<h4>{notification.title}</h4>
			<p>{notification.message}</p>
			<span>{notification.date}</span>
		</div>
	);
}

export default NotificationItem;