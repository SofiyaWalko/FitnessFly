import { useEffect, useState } from "react";
import styles from "../shared/formModal.module.css";
import LitleButton from "@/components/ui/LittleButton/LittleButton";
import CustomSelect from "@/components/ui/CustomSelect/CustomSelect";
import { API_BASE } from "@/config";

function GoalForm({ closeForm, onSuccess, initialGoal }) {
	const [form, setForm] = useState({
		height: "",
		weight: "",
		waist: "",
		chest: "",
		hips: "",
		activity: "",
		goal: initialGoal ?? "",
	});

	/* подставляем последние значения из БД */
	useEffect(() => {
		const user_id = localStorage.getItem("user_id");

		fetch(`${API_BASE}/home/getParameters.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ user_id }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data || data.error) return;

				setForm((prev) => ({
					...prev,
					height: data.height ?? "",
					weight: data.weight ?? "",
					waist: data.waist ?? "",
					chest: data.chest ?? "",
					hips: data.hips ?? "",
					activity:
						data.activity != null ? String(data.activity) : "",
				}));
			})
			.catch((err) => console.log(err));
	}, []);

	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	}

	function submitForm() {
		const user_id = localStorage.getItem("user_id");

		fetch(`${API_BASE}/home/updateGoal.php`, {
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
						<CustomSelect
							label="Уровень активности"
							value={form.activity}
							placeholder="Не выбрано"
							options={[
								{ value: "1", label: "Сидячий образ жизни" },
								{ value: "2", label: "Небольшая активность" },
								{ value: "3", label: "Умеренная активность" },
								{ value: "4", label: "Высокая активность" },
								{
									value: "5",
									label: "Очень высокая активность",
								},
							]}
							onChange={(value) =>
								setForm({ ...form, activity: value })
							}
						/>
					</div>

					<div className={styles.field}>
						<CustomSelect
							label="Цель"
							value={form.goal}
							placeholder="Не выбрано"
							options={[
								{ value: "Снижение веса", label: "Снизить вес" },
								{ value: "Набор веса", label: "Набрать массу" },
								{
									value: "Поддержание веса",
									label: "Поддержание веса",
								},
							]}
							onChange={(value) =>
								setForm({ ...form, goal: value })
							}
						/>
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
