import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./home.module.css";

import TabBig from "../components/TabBig";
 
function Home() {
	return (		
		<>
		<Header/>
		<section className={styles.home} id="reviews">
			<div className={styles.container}>
				<div className={styles.tabbig}>
					<TabBig link="/home" text="Профиль"/>
					<TabBig link="/home/programs-started" text="Начатые программы"/>
					<TabBig link="/home/programs-completed" text="Завершенные программы"/>
					<TabBig link="/home/favorite-training" text="Любимые тренировки"/>
					<TabBig link="/home/favorite-recipes" text="Любимые рецепты"/>
				</div>
				<Outlet/>				
			</div>
		</section>	
		<Footer/>
		</>
	)
}

export default Home;
