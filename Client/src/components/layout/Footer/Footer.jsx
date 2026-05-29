import { Link } from "react-router-dom";
import styles from "./footer.module.css";
import insta from "@assets/images/instagram.svg";
import vk from "@assets/images/vk.svg";
import tg from "@assets/images/telegram.svg";

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={`${styles.container} ${styles.footerContent}`}>
				<span>© 2025 FitnessFly</span>
				<nav className={styles.social}>
					<Link to="/404">
						<img src={insta} alt="instagram" />
					</Link>
					<Link to="/404">
						<img src={vk} alt="vk" />
					</Link>
					<Link to="/404">
						<img src={tg} alt="telegram" />
					</Link>
				</nav>
			</div>
		</footer>
	);
}

export default Footer;
