import Header from "../Header/Header";
import styles from "./authlayout.module.css";

function AuthLayout({ children }) {
	return (
		<div className={styles.wrapper}>
			<Header />
			<div className={styles.content}>{children}</div>
		</div>
	);
}

export default AuthLayout;
