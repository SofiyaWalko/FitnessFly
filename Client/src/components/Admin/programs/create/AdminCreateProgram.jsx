import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./admincreateprogram.module.css";

function AdminCreateProgram() {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);

	const { id } = useParams();
	const isEdit = Boolean(id);

	const [categories, setCategories] = useState([]);

	const [form, setForm] = useState({
		title: "",
		description: "",
		duration_days: "",
		difficulty_level: "",
		category_id: "",
		image: null,
	});

	const [error, setError] = useState("");

	/* ======================
	   КАТЕГОРИИ
	====================== */
	useEffect(() => {
		fetch("http://fitnessfly.local/api/categories/getProgramCategories.php")
			.then((res) => res.json())
			.then(setCategories);
	}, []);

	/* ======================
	   CHANGE
	====================== */
	function handleChange(e) {
		const { name, value, files } = e.target;

		if (name === "image") {
			setForm({ ...form, image: files[0] });
		} else {
			setForm({ ...form, [name]: value });
		}
	}

	function handleRemoveFile() {
		setForm({ ...form, image: null });

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	useEffect(() => {
		if (!isEdit) return;

		fetch("http://fitnessfly.local/api/programs/getProgramByIdAdmin.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setForm({
					title: data.title,
					description: data.description,
					duration_days: data.duration_days,
					difficulty_level: data.difficulty_level,
					category_id: data.category_id,
					image: null,
				});
			});
	}, [id]);

	/* ======================
	   VALIDATE
	====================== */
	function validate() {
		if (!form.title.trim()) return "Введите название";
		if (!form.category_id) return "Выберите категорию";

		if (!form.duration_days || form.duration_days < 1)
			return "Количество дней должно быть больше 0";

		if (!form.difficulty_level) return "Введите уровень сложности";

		if (!isEdit && !form.image) return "Загрузите изображение";

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
			if (form[key] !== null) {
				formData.append(key, form[key]);
			}
		});

		formData.append("id", id || "");

		const url = isEdit
			? "http://fitnessfly.local/api/programs/updateProgram.php"
			: "http://fitnessfly.local/api/programs/createProgram.php";

		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate("/adminpanel/programs");
				} else {
					setError("Ошибка при сохранении");
				}
			});
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>
				{isEdit ? "Редактировать программу" : "Добавить программу"}
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
					<label>Описание</label>
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.field}>
					<label>Длительность (дни)</label>
					<input
						type="number"
						name="duration_days"
						value={form.duration_days}
						onChange={handleChange}
						min="1"
					/>
				</div>

				<div className={styles.field}>
					<label>Уровень сложности</label>
					<input
						name="difficulty_level"
						value={form.difficulty_level}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.field}>
					<label>Категория</label>
					<select
						name="category_id"
						value={form.category_id}
						onChange={handleChange}
					>
						<option value="">Выберите категорию</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>

				<div className={styles.field}>
					<label>Изображение</label>

					<label className={styles.fileLabel}>
						Выбрать файл
						<input
							type="file"
							name="image"
							className={styles.fileInput}
							onChange={handleChange}
							ref={fileInputRef}
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
								onClick={handleRemoveFile}
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

export default AdminCreateProgram;
