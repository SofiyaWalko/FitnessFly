import { useState } from "react";
import styles from "./registerform.module.css";

function RegisterStep2({ formData, setFormData }) {
	const [errors, setErrors] = useState({});

	function change(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value });

		// очищаем ошибку при изменении
		setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
	}

	function submit() {
		let newErrors = {};

		// обязательные
		if (!formData.gender) {
			newErrors.gender = "Выберите пол";
		}

		if (!formData.birthday) {
			newErrors.birthday = "Введите дату рождения";
		}

		// проверка на отрицательные числа
		if (formData.height && Number(formData.height) < 0) {
			newErrors.height = "Не может быть отрицательным";
		}

		if (formData.weight && Number(formData.weight) < 0) {
			newErrors.weight = "Не может быть отрицательным";
		}

		if (formData.chest && Number(formData.chest) < 0) {
			newErrors.chest = "Не может быть отрицательным";
		}

		if (formData.waist && Number(formData.waist) < 0) {
			newErrors.waist = "Не может быть отрицательным";
		}

		if (formData.hips && Number(formData.hips) < 0) {
			newErrors.hips = "Не может быть отрицательным";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const preparedData = {
			...formData,

			// строки
			goal: formData.goal || "",
			activity: formData.activity ? Number(formData.activity) : 0,

			// числа
			height: Number(formData.height) || 0,
			weight: Number(formData.weight) || 0,
			chest: Number(formData.chest) || 0,
			waist: Number(formData.waist) || 0,
			hips: Number(formData.hips) || 0,
		};

		fetch("http://fitnessfly.local/api/auth/register.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(preparedData),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "success") {
					localStorage.setItem("user_id", data.user_id);
					window.location = "/home";
				} else {
					setErrors({ server: data.message });
				}
			})
			.catch(() => {
				setErrors({ server: "Ошибка соединения с сервером" });
			});
	}

	return (
		<>
			<h2 className={styles.title}>Расчёт суточной нормы калорий</h2>

			<form
				className={styles.grid}
				onSubmit={(e) => {
					e.preventDefault();
					submit();
				}}
			>
				{/* Пол */}
				<div className={styles.field}>
					<label>Пол *</label>

					<div className={styles.radioGroup}>
						<label>
							<input
								type="radio"
								name="gender"
								value="female"
								onChange={change}
							/>
							Женский
						</label>

						<label>
							<input
								type="radio"
								name="gender"
								value="male"
								onChange={change}
							/>
							Мужской
						</label>
					</div>

					{errors.gender && (
						<div className={styles.error}>{errors.gender}</div>
					)}
				</div>

				<div></div>

				{/* Дата рождения */}
				<div className={styles.field}>
					<label>Дата рождения *</label>
					<input
						type="date"
						name="birthday"
						value={formData.birthday}
						onChange={change}
					/>
					{errors.birthday && (
						<div className={styles.error}>{errors.birthday}</div>
					)}
				</div>

				{/* Рост */}
				<div className={styles.field}>
					<label>Рост, см</label>
					<input
						name="height"
						value={formData.height}
						onChange={change}
					/>
					{errors.height && (
						<div className={styles.error}>{errors.height}</div>
					)}
				</div>

				{/* Вес */}
				<div className={styles.field}>
					<label>Вес, кг</label>
					<input
						name="weight"
						value={formData.weight}
						onChange={change}
					/>
					{errors.weight && (
						<div className={styles.error}>{errors.weight}</div>
					)}
				</div>

				{/* Грудь */}
				<div className={styles.field}>
					<label>Обхват груди, см</label>
					<input
						name="chest"
						value={formData.chest}
						onChange={change}
					/>
					{errors.chest && (
						<div className={styles.error}>{errors.chest}</div>
					)}
				</div>

				{/* Талия */}
				<div className={styles.field}>
					<label>Обхват талии, см</label>
					<input
						name="waist"
						value={formData.waist}
						onChange={change}
					/>
					{errors.waist && (
						<div className={styles.error}>{errors.waist}</div>
					)}
				</div>

				{/* Бёдра */}
				<div className={styles.field}>
					<label>Обхват бёдер, см</label>
					<input
						name="hips"
						value={formData.hips}
						onChange={change}
					/>
					{errors.hips && (
						<div className={styles.error}>{errors.hips}</div>
					)}
				</div>

				{/* Активность */}
				<div className={styles.field}>
					<label>Уровень активности</label>

					<select
						name="activity"
						value={formData.activity}
						onChange={change}
					>
						<option value="">Не выбрано</option>
						<option value="1">Сидячий образ жизни</option>
						<option value="2">Небольшая активность</option>
						<option value="3">Умеренная активность</option>
						<option value="4">Высокая активность</option>
						<option value="5">Очень высокая активность</option>
					</select>
				</div>

				{/* Цель */}
				<div className={styles.field}>
					<label>Цель</label>

					<select name="goal" value={formData.goal} onChange={change}>
						<option value="">Не выбрано</option>
						<option value="Снижение веса">Снижение веса</option>
						<option value="Поддержание веса">
							Поддержание веса
						</option>
						<option value="Набор веса">Набор веса</option>
					</select>
				</div>

				<button type="submit" className={styles.button}>
					Зарегистрироваться
				</button>
			</form>

			{/* серверная ошибка */}
			{errors.server && (
				<div className={styles.error}>{errors.server}</div>
			)}
		</>
	);
}

export default RegisterStep2;
