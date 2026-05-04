import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "../LitleButton";

function GoalForm({ closeForm, onSuccess }) {
	const [form, setForm] = useState({
		height: "",
		weight: "",
		waist: "",
		chest: "",
		hips: "",
		activity: "",
		goal: "",
	});

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	function submitForm() {
		const user_id = localStorage.getItem("user_id");

		fetch("http://fitnessfly.local/api/home/updateGoal.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_id,
				...form,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.success) {
					closeForm();

					if (onSuccess) {
						onSuccess();
					}
				}
			})
			.catch((err) => console.log(err));
	}

	return (
		<div className={styles.modal}>
			<div className={styles.modal_content}>
				<h2>Расчёт суточной нормы калорий</h2>

				<div className={styles.form_grid}>
					<input
						name="height"
						placeholder="Рост, см"
						onChange={handleChange}
					/>
					<input
						name="weight"
						placeholder="Вес, кг"
						onChange={handleChange}
					/>
					<input
						name="waist"
						placeholder="Обхват талии"
						onChange={handleChange}
					/>
					<input
						name="chest"
						placeholder="Обхват груди"
						onChange={handleChange}
					/>
					<input
						name="hips"
						placeholder="Обхват бёдер"
						onChange={handleChange}
					/>

					<select name="activity" onChange={handleChange}>
						<option value="">Уровень активности</option>
						<option value="1">Сидячий образ жизни</option>
						<option value="2">Небольшая активность</option>
						<option value="3">Умеренная активность</option>
						<option value="4">Высокая активность</option>
						<option value="5">Очень высокая активность</option>
					</select>

					<select name="goal" onChange={handleChange}>
						<option value="">Цель</option>
						<option value="loss">Снизить вес</option>
						<option value="gain">Набрать массу</option>
						<option value="maintain">Поддержание веса</option>
					</select>
				</div>

				<LitleButton onClick={submitForm}>Рассчитать</LitleButton>
				<LitleButton onClick={closeForm}>Закрыть</LitleButton>
			</div>
		</div>
	);
}

export default GoalForm;
