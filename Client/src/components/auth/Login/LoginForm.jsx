import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "@components/Modal/Modal";
import styles from "./loginform.module.css";

function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [infoModal, setInfoModal] = useState({
		open: false,
		title: "",
		message: "",
	});

	const navigate = useNavigate();

	function closeInfoModal() {
		setInfoModal({
			open: false,
			title: "",
			message: "",
		});
	}

	function login() {
		if (!email.trim()) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Введите email",
			});
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Введите корректный email",
			});
			return;
		}

		if (password.length < 8) {
			setInfoModal({
				open: true,
				title: "Ошибка",
				message: "Пароль должен содержать минимум 8 символов",
			});
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
					setInfoModal({
						open: true,
						title: "Ошибка",
						message: "Неверный логин или пароль",
					});
				}
			});
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Вход</h2>

			<form
				className={styles.form}
				onSubmit={(e) => {
					e.preventDefault();
					login();
				}}
			>
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

				<button type="submit" className={styles.button}>
					Войти
				</button>
			</form>

			<div className={styles.register}>
				Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
			</div>

			<Modal
				open={infoModal.open}
				title={infoModal.title}
				onClose={closeInfoModal}
			>
				{infoModal.message}
			</Modal>
		</div>
	);
}

export default LoginForm;
