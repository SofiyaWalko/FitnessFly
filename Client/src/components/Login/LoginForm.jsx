import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./loginform.module.css";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	function login() {
		if (!email.trim()) {
			alert("Введите email");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			alert("Введите корректный email");
			return;
		}

		if (password.length < 8) {
			alert("Пароль должен содержать минимум 8 символов");
			return;
		}

		fetch("http://fitnessfly.local/api/auth/login.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === "success") {
					localStorage.setItem("user_id", data.user_id);
					localStorage.setItem("role", data.role);

					if (data.role === 1) {
						navigate("/adminpanel/programs");
					} else {
						navigate("/home");
					}
				} else {
					alert("Неверный логин или пароль");
				}
			});
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Вход</h2>

			<div className={styles.form}>
				<div className={styles.field}>
					<label>Логин</label>
					<input
						placeholder="Введите email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className={styles.field}>
					<label>Пароль</label>
					<input
						type="password"
						placeholder="Введите пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<button className={styles.button} onClick={login}>
					Войти
				</button>
			</div>

			<div className={styles.register}>
				Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
			</div>
		</div>
	);
}

export default LoginForm;
