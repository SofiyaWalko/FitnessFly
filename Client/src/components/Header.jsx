import { Link } from "react-router-dom";
import styles from "./header.module.css";
import logo from "../assets/images/logo.svg";
import { HashLink } from "react-router-hash-link";

function Header() {
	const user = localStorage.getItem("user_id");

	return (
		<header className={styles.header}>
			<div className={`${styles.container} ${styles.headerContent}`}>
				<div className={styles.logo}>
					<Link to="/">
						<img src={logo} alt="FitnessFly logo" />
					</Link>
					<span>FitnessFly</span>
				</div>

				<nav className={styles.nav}>
					<ul className={styles.menu}>
						<li>
							<Link to="/programs">Программы</Link>
						</li>
						<li>
							<Link to="/recipes">Рецепты</Link>
						</li>
						<li>
							<HashLink smooth to="/#reviews">
								Отзывы
							</HashLink>
						</li>

						<li>
							<HashLink smooth to="/#faq">
								Ответы на вопросы
							</HashLink>
						</li>
					</ul>
				</nav>

				<div className={styles.actions}>
					{user ? (
						<Link to="/home" className={styles.login}>
							Личный кабинет
						</Link>
					) : (
						<>
							<Link to="/register" className={styles.register}>
								Регистрация
							</Link>

							<Link to="/login" className={styles.login}>
								Войти
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

export default Header;
