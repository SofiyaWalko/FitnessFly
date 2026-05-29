import { Link } from "react-router-dom";
import styles from "./hero.module.css";
import girl from "@assets/images/girl.png";

function Hero() {
	const user_id = localStorage.getItem("user_id");
	const linkTo = user_id ? "/programs" : "/register";

	return (
		<section className={styles.hero}>
			<div className={styles.container}>
				<div className={styles.heroContent}>
					<div className={styles.content}>
						<h1 className={styles.title}>
							Твоё идеальное тело начинается здесь
						</h1>

						<p className={styles.text}>
							Веб-платформа для девушек с программами тренировок,
							рецептами и удобным трекером прогресса
						</p>

						<Link to={linkTo} className={styles.actions}>
							<button className={styles.startBtn}>
								<span className={styles.buttonText}>
									Начать тренироваться
								</span>
							</button>
						</Link>
					</div>

					<div className={styles.imageWrapper}>
						<img src={girl} alt="fitness-girl" />
					</div>
				</div>
			</div>
		</section>
	);
}

export default Hero;
