import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./header.module.css";
import logo from "@assets/images/logo.svg";
import { HashLink } from "react-router-hash-link";

function Header() {
	const user = localStorage.getItem("user_id");
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className={styles.header}>
			<div className={`${styles.container} ${styles.headerContent}`}>
				<div className={styles.logo}>
					<Link to="/">
						<img src={logo} alt="FitnessFly logo" />
					</Link>
					<span>FitnessFly</span>
				</div>

				<div
					className={`${styles.menuWrapper} ${isMenuOpen ? styles.menuWrapperOpen : ""}`}
				>
					<nav className={styles.nav}>
						<ul className={styles.menu}>
							<li>
								<Link
									to="/programs"
									onClick={() => setIsMenuOpen(false)}
								>
									Программы
								</Link>
							</li>
							<li>
								<Link
									to="/recipes"
									onClick={() => setIsMenuOpen(false)}
								>
									Рецепты
								</Link>
							</li>
							<li>
								<HashLink
									smooth
									to="/#reviews"
									onClick={() => setIsMenuOpen(false)}
								>
									Отзывы
								</HashLink>
							</li>

							<li>
								<HashLink
									smooth
									to="/#faq"
									onClick={() => setIsMenuOpen(false)}
								>
									Ответы на вопросы
								</HashLink>
							</li>
						</ul>
					</nav>

					<div className={styles.actions}>
						{user ? (
							<Link
								to="/home"
								className={styles.login}
								onClick={() => setIsMenuOpen(false)}
							>
								Личный кабинет
							</Link>
						) : (
							<>
								<Link
									to="/register"
									className={styles.register}
									onClick={() => setIsMenuOpen(false)}
								>
									Регистрация
								</Link>

								<Link
									to="/login"
									className={styles.login}
									onClick={() => setIsMenuOpen(false)}
								>
									Войти
								</Link>
							</>
						)}
					</div>
				</div>

				<button
					className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ""}`}
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Меню"
				>
					<span className={styles.bar}></span>
					<span className={styles.bar}></span>
					<span className={styles.bar}></span>
				</button>
			</div>
		</header>
	);
}

export default Header;
