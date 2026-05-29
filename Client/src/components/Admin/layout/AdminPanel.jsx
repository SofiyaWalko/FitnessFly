import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminHeader from "./AdminHeader";
import Footer from "@/components/layout/Footer/Footer";
import TabBig from "@components/ui/TabBig/TabBig";

import styles from "./adminpanel.module.css";

function AdminPanel() {
	const [newReviewsCount, setNewReviewsCount] = useState(0);

	useEffect(() => {
		function fetchCount() {
			fetch("http://fitnessfly.local/api/reviews/getNewReviewsCount.php")
				.then((res) => res.json())
				.then((data) => setNewReviewsCount(data.count));
		}

		fetchCount(); // сразу

		const interval = setInterval(fetchCount, 5000); // каждые 5 сек

		return () => clearInterval(interval); // очистка
	}, []);

	return (
		<>
			<div className={styles.page}>
				<AdminHeader />
				<section className={styles.adminpanel}>
					<div className={styles.container}>
						<div className={styles.tabbig}>
							<TabBig
								link="/adminpanel/programs"
								text="Программы тренировок"
							/>
							<TabBig
								link="/adminpanel/trainings"
								text="Тренировки"
							/>
							<TabBig link="/adminpanel/recipes" text="Рецепты" />
							<TabBig
								link="/adminpanel/reviews"
								text="Отзывы"
								badge={newReviewsCount}
							/>
							<TabBig link="/adminpanel/archive" text="Архив" />
						</div>
						<Outlet context={{ setNewReviewsCount }} />
					</div>
				</section>

				<Footer />
			</div>
		</>
	);
}

export default AdminPanel;
