import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./admincreatetraining.module.css";

function AdminCreateTraining() {
	const navigate = useNavigate();
	const { programId, day, id } = useParams();
	const isEdit = Boolean(id);

	const videoInputRef = useRef(null);
	const imageInputRef = useRef(null);

	const [form, setForm] = useState({
		title: "",
		duration_minutes: "",
		calories: "",
		heart_rate: "",
		points_reward: "",
		video: null,
		image: null,
	});

	const [error, setError] = useState("");

	/* ======================
	   ЗАГРУЗКА ДАННЫХ (EDIT)
	====================== */
	useEffect(() => {
		if (!isEdit) return;

		fetch("http://fitnessfly.local/api/training/getTrainingById.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setForm({
					title: data.title,
					duration_minutes: data.duration_minutes,
					calories: data.calories,
					heart_rate: data.heart_rate,
					points_reward: data.points_reward,
					video: null,
					image: null,
				});
			});
	}, [id, isEdit]);

	/* ======================
	   CHANGE
	====================== */
	function handleChange(e) {
		const { name, value, files } = e.target;

		if (name === "image" || name === "video") {
			setForm({ ...form, [name]: files[0] });
			return;
		}

		if (
			[
				"duration_minutes",
				"calories",
				"heart_rate",
				"points_reward",
			].includes(name)
		) {
			if (
				[
					"duration_minutes",
					"calories",
					"heart_rate",
					"points_reward",
				].includes(name)
			) {
				if (
					["duration_minutes", "calories", "heart_rate"].includes(
						name,
					)
				) {
					const val = Math.max(1, Number(value));
					setForm({ ...form, [name]: val });
					return;
				}

				if (name === "points_reward") {
					const val = Math.max(0, Number(value));
					setForm({ ...form, [name]: val });
					return;
				}
			}
			setForm({ ...form, [name]: val });
			return;
		}

		setForm({ ...form, [name]: value });
	}

	function handleRemoveFile(type) {
		setForm({ ...form, [type]: null });

		if (type === "video" && videoInputRef.current) {
			videoInputRef.current.value = "";
		}
		if (type === "image" && imageInputRef.current) {
			imageInputRef.current.value = "";
		}
	}

	/* ======================
	   VALIDATE
	====================== */
	function validate() {
		if (!form.title.trim()) return "Введите название";

		if (!form.duration_minutes || form.duration_minutes <= 0)
			return "Длительность должна быть больше 0";

		if (!form.calories || form.calories <= 0)
			return "Калории должны быть больше 0";

		if (!form.heart_rate || form.heart_rate <= 0)
			return "Пульс должен быть больше 0";

		if (!form.points_reward && form.points_reward !== 0)
			return "Введите баллы";

		if (form.points_reward < 0) return "Баллы не могут быть отрицательными";

		// ВСЕГДА обязательны
		if (!isEdit) {
			if (!form.video) return "Загрузите видео";
			if (!form.image) return "Загрузите изображение";
		}

		return "";
	}

	/* ======================
	   SUBMIT
	====================== */
	function handleSubmit(e) {
		e.preventDefault();

		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}

		const formData = new FormData();

		Object.keys(form).forEach((key) => {
			if (form[key] !== null && form[key] !== "") {
				formData.append(key, form[key]);
			}
		});

		formData.append("id", id || "");

		if (!isEdit) {
			formData.append("program_id", programId);
			formData.append("day_number", day);
		}

		const url = isEdit
			? "http://fitnessfly.local/api/training/updateTraining.php"
			: "http://fitnessfly.local/api/training/createTrainingAndAdd.php";

		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate(-1);
				} else {
					setError("Ошибка при сохранении");
				}
			});
	}

	/* ======================
	   UI
	====================== */
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>
				{isEdit ? "Редактировать тренировку" : "Добавить тренировку"}
			</h2>

			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.field}>
					<label>Название</label>
					<input
						name="title"
						value={form.title}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.field}>
					<label>Длительность (мин)</label>
					<input
						type="number"
						name="duration_minutes"
						value={form.duration_minutes}
						onChange={handleChange}
						min="1"
					/>
				</div>

				<div className={styles.field}>
					<label>Калории</label>
					<input
						type="number"
						name="calories"
						value={form.calories}
						onChange={handleChange}
						min="1"
					/>
				</div>

				<div className={styles.field}>
					<label>Пульс</label>
					<input
						type="number"
						name="heart_rate"
						value={form.heart_rate}
						onChange={handleChange}
						min="1"
					/>
				</div>

				<div className={styles.field}>
					<label>Баллы</label>
					<input
						type="number"
						name="points_reward"
						value={form.points_reward}
						onChange={handleChange}
						min="0"
					/>
				</div>

				{/* Видео */}
				<div className={styles.field}>
					<label>Видео</label>

					<label className={styles.fileLabel}>
						Выбрать файл
						<input
							type="file"
							name="video"
							className={styles.fileInput}
							onChange={handleChange}
							ref={videoInputRef}
						/>
					</label>

					{form.video && (
						<div className={styles.fileInfo}>
							<span className={styles.fileName}>
								{form.video.name}
							</span>
							<button
								type="button"
								className={styles.removeFileBtn}
								onClick={() => handleRemoveFile("video")}
							>
								✕
							</button>
						</div>
					)}
				</div>

				{/* Изображение */}
				<div className={styles.field}>
					<label>Изображение</label>

					<label className={styles.fileLabel}>
						Выбрать файл
						<input
							type="file"
							name="image"
							className={styles.fileInput}
							onChange={handleChange}
							ref={imageInputRef}
						/>
					</label>

					{form.image && (
						<div className={styles.fileInfo}>
							<span className={styles.fileName}>
								{form.image.name}
							</span>
							<button
								type="button"
								className={styles.removeFileBtn}
								onClick={() => handleRemoveFile("image")}
							>
								✕
							</button>
						</div>
					)}
				</div>

				{error && <div className={styles.error}>{error}</div>}

				<button className={styles.button}>
					{isEdit ? "Сохранить" : "Создать"}
				</button>
			</form>
		</div>
	);
}

export default AdminCreateTraining;
