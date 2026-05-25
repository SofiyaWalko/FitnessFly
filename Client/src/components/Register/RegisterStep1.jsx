import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./registerform.module.css"

function RegisterStep1({ formData, setFormData, next }) {

	const [errors, setErrors] = useState({})

	function change(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value })

		// очищаем ошибку при вводе
		setErrors(prev => ({ ...prev, [e.target.name]: "" }))
	}

	function validate() {

		let newErrors = {}

		// Имя
		if (!formData.name.trim()) {
			newErrors.name = "Введите имя"
		}

		// Email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			newErrors.email = "Введите корректный email"
		}

		// Телефон
		const phoneRegex = /^\+375\d{9}$/
		if (!phoneRegex.test(formData.phone)) {
			newErrors.phone = "Формат: +375XXXXXXXXX"
		}

		// Способ уведомлений
		if (!formData.notify) {
			newErrors.notify = "Выберите способ уведомлений"
		}

		// Пароль
		if (formData.password.length < 8) {
			newErrors.password = "Минимум 8 символов"
		}

		// Повтор пароля
		if (formData.password !== formData.repeatPassword) {
			newErrors.repeatPassword = "Пароли не совпадают"
		}

		setErrors(newErrors)

		return Object.keys(newErrors).length === 0
	}

	function nextStep() {
		if (validate()) {
			next()
		}
	}

	return (
		<>
			<h2 className={styles.title}>Регистрация</h2>

			<div className={styles.grid}>

				{/* Имя */}
				<div className={styles.field}>
					<label>Имя</label>
					<input
						name="name"
						value={formData.name}
						onChange={change}
					/>
					{errors.name && <div className={styles.error}>{errors.name}</div>}
				</div>

				{/* Телефон */}
				<div className={styles.field}>
					<label>Телефон</label>
					<input
						name="phone"
						placeholder="+375XXXXXXXXX"
						value={formData.phone}
						onChange={change}
					/>
					{errors.phone && <div className={styles.error}>{errors.phone}</div>}
				</div>

				{/* Email */}
				<div className={styles.field}>
					<label>Email</label>
					<input
						name="email"
						value={formData.email}
						onChange={change}
					/>
					{errors.email && <div className={styles.error}>{errors.email}</div>}
				</div>

				{/* Уведомления */}
				<div className={styles.field}>
					<label>Выберите способ получения уведомлений</label>

					<div className={styles.radioGroup}>
						<label>
							<input
								type="radio"
								name="notify"
								value="email"
								checked={formData.notify === "email"}
								onChange={change}
							/>
							Эл. почта
						</label>

						<label>
							<input
								type="radio"
								name="notify"
								value="telegram"
								checked={formData.notify === "telegram"}
								onChange={change}
							/>
							Телеграм-бот
						</label>
					</div>

					{errors.notify && <div className={styles.error}>{errors.notify}</div>}
				</div>

				{/* Пароль */}
				<div className={styles.field}>
					<label>Пароль</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={change}
					/>
					{errors.password && <div className={styles.error}>{errors.password}</div>}
				</div>

				{/* Повтор пароля */}
				<div className={styles.field}>
					<label>Повторите пароль</label>
					<input
						type="password"
						name="repeatPassword"
						value={formData.repeatPassword}
						onChange={change}
					/>
					{errors.repeatPassword && <div className={styles.error}>{errors.repeatPassword}</div>}
				</div>

			</div>

			<button className={styles.button} onClick={nextStep}>
				Далее
			</button>

			<div className={styles.login}>
				Уже есть аккаунт? <Link to="/login">Войти</Link>
			</div>
		</>
	)
}

export default RegisterStep1