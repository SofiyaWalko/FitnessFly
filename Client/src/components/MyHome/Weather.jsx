import { useEffect, useState } from "react";
import styles from "@/pages/home/myhome.module.css";
import weatherIcon from "@assets/images/weather.svg";

function Weather() {
	const [city, setCity] = useState("");
	const [temp, setTemp] = useState(null);
	const [description, setDescription] = useState("");
	const [icon, setIcon] = useState("");
	const [editing, setEditing] = useState(false);

	const user_id = localStorage.getItem("user_id");

	useEffect(() => {
		loadWeather();
	}, []);

	function loadWeather() {
		fetch("http://fitnessfly.local/api/weather/get_weather.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "success") {
					setCity(data.city);
					setTemp(data.temperature);
					setDescription(data.description);
					setIcon(data.icon);
				}
			});
	}

	function saveCity() {
		fetch("http://fitnessfly.local/api/weather/update_city.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id, city }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "success") {
					setEditing(false);
					loadWeather();
				}
			});
	}

	return (
		<div className={styles.weather}>
			<div className={styles.question}>
				<img src={weatherIcon} alt="icon" />
				<span>Тренируешься сегодня на улице?</span>
			</div>

			<div className={styles.weather_items}>
				<div className={styles.item}>
					<span>Ваш город</span>

					{editing ? (
						<div className={styles.change_city}>
							<input
								value={city}
								onChange={(e) => setCity(e.target.value)}
							/>
							<button className={styles.OK} onClick={saveCity}>
								OK
							</button>
						</div>
					) : (
						<span onClick={() => setEditing(true)}>{city}</span>
					)}
				</div>

				<div className={styles.item}>
					<span>Температура</span>
					<span>{temp !== null ? `${temp}°C` : "..."}</span>
				</div>

				<div className={styles.item}>
					<span>Погода</span>
					<span>{description}</span>
				</div>

				{icon && (
					<img
						src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
						alt="weather"
					/>
				)}
			</div>
		</div>
	);
}

export default Weather;
