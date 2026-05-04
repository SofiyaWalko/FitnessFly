import styles from "./notificationsbutton.module.css";
import bellIcon from "../assets/images/bell.svg";

function NotificationsButton({ onClick, count }) {
	return (
		<button className={styles.button} onClick={onClick}>
			<img src={bellIcon} alt="notifications" />

			{count > 0 && (
				<span className={styles.badge}>{count}</span>
			)}
		</button>
	);
}

export default NotificationsButton;