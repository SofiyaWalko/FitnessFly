import { useState, useEffect } from "react";

import LogoutButton from "@/components/LogoutButton/LogoutButton";
import styles from "./myhome.module.css";

import NotificationsButton from "@/components/NotificationButton/NotificationsButton";
import NotificationsPanel from "@components/MyHome/NotificationsPanel";
import Norm from "@components/MyHome/Norm";
import Weather from "@components/MyHome/Weather";
import PersonalInfo from "@components/MyHome/PersonalInfo";
import Parameters from "@components/MyHome/Parameters";
import ProgressStats from "@components/MyHome/ProgressStats";

function MyHome() {
	const [refresh, setRefresh] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [count, setCount] = useState(0);

	function updateData() {
		setRefresh((prev) => !prev);
	}

	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		function fetchCount() {
			fetch(
				"http://fitnessfly.local/api/notifications/getUnreadCount.php",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ user_id }),
				},
			)
				.then((res) => res.json())
				.then((data) => setCount(data.count));
		}

		fetchCount();
		const interval = setInterval(fetchCount, 5000);

		return () => clearInterval(interval);
	}, []);

	return (
		<>
			<div className={styles.header}>
				<h2 className={styles.title}>Мой профиль</h2>
				<div className={styles.buttons}>
					<NotificationsButton
						onClick={() => setIsOpen((prev) => !prev)}
						count={count}
					/>
					<LogoutButton />
				</div>
			</div>

			<div className={styles.home_wrapper}>
				<div className={styles.info}>
					<div className={styles.norm_weather}>
						<Norm refresh={refresh} />
						<Weather />
					</div>

					<PersonalInfo onUpdate={updateData} />
				</div>

				<div className={styles.chart_parameters}>
					<ProgressStats refresh={refresh} />
					<Parameters refresh={refresh} onUpdate={updateData} />
				</div>
			</div>

			{isOpen && (
				<NotificationsPanel
					onClose={() => setIsOpen(false)}
					onRead={() => setCount(0)}
				/>
			)}
		</>
	);
}

export default MyHome;
