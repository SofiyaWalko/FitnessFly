import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./mainlayout.module.css";

function MainLayout({ children }) {
	return (
		<div className={styles.wrapper}>
			<Header />
			<div className={styles.content}>{children}</div>
			<Footer />
		</div>
	);
}

export default MainLayout;
