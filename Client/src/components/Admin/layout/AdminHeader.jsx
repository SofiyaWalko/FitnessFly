import { Link } from "react-router-dom";
import styles from "./adminheader.module.css";
import logo from "@assets/images/logo.svg";

function AdminHeader() {
	return (
		<header className={styles.header}>
			<div className={`${styles.container} ${styles.headerContent}`}>
				<div className={styles.logo}>
					<Link to="/adminpanel/programs">
						<img src={logo} alt="FitnessFly logo" />
					</Link>
					<span>FitnessFly</span>
				</div>

				<span>Панель администратора</span>
			</div>
		</header>
	);
}

export default AdminHeader;
