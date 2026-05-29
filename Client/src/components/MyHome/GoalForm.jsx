import { useState } from "react";
import styles from "./goalform.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";

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
					<div className={styles.field}>
						<label>Рост, см</label>
						<input
							name="height"
							value={form.height}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Вес, кг</label>
						<input
							name="weight"
							value={form.weight}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват талии, см</label>
						<input
							name="waist"
							value={form.waist}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват груди, см</label>
						<input
							name="chest"
							value={form.chest}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Обхват бёдер, см</label>
						<input
							name="hips"
							value={form.hips}
							onChange={handleChange}
						/>
					</div>

					<div className={styles.field}>
						<label>Уровень активности</label>
						<select
							name="activity"
							value={form.activity}
							onChange={handleChange}
						>
							<option value="">Не выбрано</option>
							<option value="1">Сидячий образ жизни</option>
							<option value="2">Небольшая активность</option>
							<option value="3">Умеренная активность</option>
							<option value="4">Высокая активность</option>
							<option value="5">Очень высокая активность</option>
						</select>
					</div>

					<div className={styles.field}>
						<label>Цель</label>
						<select
							name="goal"
							value={form.goal}
							onChange={handleChange}
						>
							<option value="">Не выбрано</option>
							<option value="Снижение веса">Снизить вес</option>
							<option value="Набор веса">Набрать массу</option>
							<option value="Поддержание веса">
								Поддержание веса
							</option>
						</select>
					</div>
				</div>

				<div className={styles.modal_buttons}></div>

				<div className={styles.buttons}>
					<LitleButton onClick={submitForm}>Рассчитать</LitleButton>
					<LitleButton variant="outline" onClick={closeForm}>
						Закрыть
					</LitleButton>
				</div>
			</div>
		</div>
	);
}

export default GoalForm;
