import LogoutButton from "@/components/LogoutButton/LogoutButton";
import styles from "./adminpagetitle.module.css";

function AdminPageTitle({ title }) {
	return (
		<div className={styles.header}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.actions}>
				<LogoutButton />
			</div>
		</div>
	);
}

export default AdminPageTitle;
