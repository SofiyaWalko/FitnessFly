import { Outlet } from "react-router-dom";
import styles from "./home.module.css";

import TabBig from "@/components/ui/TabBig/TabBig";

function Home() {
	return (
		<section className={styles.home} id="reviews">
			<div className={styles.container}>
				<div className={styles.tabbig}>
					<TabBig link="/home" text="Профиль" />
					<TabBig
						link="/home/programs-started"
						text="Начатые программы"
					/>
					<TabBig
						link="/home/programs-completed"
						text="Завершенные программы"
					/>
					<TabBig
						link="/home/favorite-training"
						text="Любимые тренировки"
					/>
					<TabBig
						link="/home/favorite-recipes"
						text="Любимые рецепты"
					/>
				</div>
				<Outlet />
			</div>
		</section>
	);
}

export default Home;
