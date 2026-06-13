import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./admincreaterecipe.module.css";
import CustomSelect from "@/components/ui/CustomSelect/CustomSelect";
import FilePreview from "@/components/ui/FilePreview/FilePreview";
import IngredientAutocomplete from "@/components/ui/IngredientAutocomplete/IngredientAutocomplete";

function AdminCreateRecipe() {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const fileInputRef = useRef(null);

	const [categories, setCategories] = useState([]);
	const [ingredients, setIngredients] = useState([
		{ name: "", quantity: "" },
	]);

	const [steps, setSteps] = useState([
		{ description: "", image: null, image_url: null },
	]);

	const [form, setForm] = useState({
		title: "",
		description: "",
		category_id: "",
		points: "",
		calories: "",
		image: null,
		image_url: null,
	});

	const [error, setError] = useState("");

	/* ======================
	   КАТЕГОРИИ
	====================== */
	useEffect(() => {
		fetch("http://fitnessfly.local/api/categories/getCategories.php")
			.then((res) => res.json())
			.then(setCategories);
	}, []);

	/* ======================
	   EDIT
	====================== */
	useEffect(() => {
		if (!isEdit) return;

		fetch("http://fitnessfly.local/api/recipes/getRecipeByIdAdmin.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((data) => {
				setForm({
					title: data.title,
					description: data.description,
					category_id: data.category_id,
					points: data.points,
					calories: data.calories,
					image: null,
					image_url: data.image
						? "http://fitnessfly.local/" + data.image
						: null,
				});

				setIngredients(
					data.ingredients.length
						? data.ingredients
						: [{ name: "", quantity: "" }],
				);

				setSteps(
					data.steps?.length
						? data.steps.map((s) => ({
								description: s.description,
								image: null,
								image_url: s.image_url || null,
							}))
						: [{ description: "", image: null, image_url: null }],
				);
			});
	}, [id]);

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
		setForm({ ...form, image: null, image_url: null });
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	/* ======================
	   INGREDIENTS
	====================== */
	function handleIngredientChange(index, field, value) {
		const updated = [...ingredients];
		updated[index][field] = value;
		setIngredients(updated);
	}

	function addIngredient() {
		setIngredients([...ingredients, { name: "", quantity: "" }]);
	}

	function removeIngredient(index) {
		if (ingredients.length === 1) return;
		setIngredients(ingredients.filter((_, i) => i !== index));
	}

	/* ======================
	   STEPS
	====================== */
	function handleStepChange(index, field, value) {
		const updated = [...steps];
		updated[index][field] = value;

		if (field === "image") {
			updated[index].image_url = null;
		}

		if (field === "image_url") {
			updated[index].image = null;
		}

		setSteps(updated);
	}

	function addStep() {
		setSteps([...steps, { description: "", image: null, image_url: null }]);
	}

	function removeStep(index) {
		if (steps.length === 1) return;
		setSteps(steps.filter((_, i) => i !== index));
	}

	/* ======================
	   VALIDATE
	====================== */
	function validate() {
		if (!form.title.trim()) return "Введите название";
		if (!form.description.trim()) return "Введите описание";
		if (!form.category_id) return "Выберите категорию";

		// калории
		if (!form.calories || Number(form.calories) < 1) {
			return "Калории должны быть не меньше 1";
		}

		// цена
		if (form.points === "" || Number(form.points) < 0) {
			return "Цена не может быть отрицательной";
		}

		// картинка рецепта (только при создании)
		if (!isEdit && !form.image) {
			return "Загрузите изображение рецепта";
		}

		// ингредиенты
		for (let ing of ingredients) {
			if (!ing.name.trim() || !ing.quantity.trim()) {
				return "Заполните все ингредиенты";
			}
		}

		//ШАГИ
		if (!steps.length) {
			return "Добавьте хотя бы один шаг";
		}

		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];

			const hasDescription = step.description.trim();
			const hasImage = step.image || step.image_url;

			//если шаг пустой полностью
			if (!hasDescription && !hasImage) {
				return `Шаг ${i + 1} не заполнен`;
			}

			//если частично заполнен
			if (!hasDescription) {
				return `Заполните описание шага ${i + 1}`;
			}

			if (!hasImage) {
				return `Добавьте изображение для шага ${i + 1}`;
			}
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
			if (key === "image_url") return; // не отправляем превью существующей картинки
			if (form[key] !== null) {
				formData.append(key, form[key]);
			}
		});

		formData.append("ingredients", JSON.stringify(ingredients));
		formData.append("id", id || "");

		formData.append(
			"steps",
			JSON.stringify(
				steps.map((s, i) => ({
					description: s.description,
					step_number: i + 1,
					image_url: s.image_url || null,
				})),
			),
		);

		steps.forEach((step, i) => {
			if (step.image) {
				formData.append(`step_image_${i}`, step.image);
			}
		});

		const url = isEdit
			? "http://fitnessfly.local/api/recipes/updateRecipe.php"
			: "http://fitnessfly.local/api/recipes/createRecipe.php";

		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					navigate("/adminpanel/recipes");
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
				{isEdit ? "Редактировать рецепт" : "Добавить рецепт"}
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
					<CustomSelect
						label="Категория"
						value={form.category_id}
						placeholder="Выберите категорию"
						options={categories.map((c) => ({
							value: c.id,
							label: c.name,
						}))}
						onChange={(value) =>
							setForm({ ...form, category_id: value })
						}
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
					<label>Цена</label>
					<input
						type="number"
						name="points"
						value={form.points}
						onChange={handleChange}
						min="0"
					/>
				</div>

				<div className={styles.field}>
					<label>Изображение</label>

					<label className={styles.fileLabel}>
						Выбрать файл
						<input
							type="file"
							name="image"
							accept="image/*"
							className={styles.fileInput}
							onChange={handleChange}
							ref={fileInputRef}
						/>
					</label>

					{(form.image || form.image_url) && (
						<FilePreview
							file={form.image}
							url={form.image_url}
							type="image"
							onRemove={handleRemoveFile}
						/>
					)}
				</div>

				{/* ИНГРЕДИЕНТЫ */}
				<div className={styles.field}>
					<label>Ингредиенты</label>

					<div className={styles.ingredients}>
						{ingredients.map((ing, i) => (
							<div key={i} className={styles.ingredientRow}>
								<IngredientAutocomplete
									value={ing.name}
									placeholder="Название"
									onChange={(value) =>
										handleIngredientChange(
											i,
											"name",
											value,
										)
									}
									onSelect={(item) => {
										const updated = [...ingredients];
										updated[i] = {
											...updated[i],
											name: item.name,
											quantity:
												updated[i].quantity ||
												item.quantity ||
												"",
										};
										setIngredients(updated);
									}}
								/>
								<input
									placeholder="Количество"
									value={ing.quantity}
									onChange={(e) =>
										handleIngredientChange(
											i,
											"quantity",
											e.target.value,
										)
									}
								/>
								<button
									type="button"
									className={styles.removeBtn}
									onClick={() => removeIngredient(i)}
								>
									✕
								</button>
							</div>
						))}
					</div>

					<button
						type="button"
						className={styles.addIngredientBtn}
						onClick={addIngredient}
					>
						+ Добавить ингредиент
					</button>
				</div>

				{/* ШАГИ */}
				<div className={styles.field}>
					<label>Шаги приготовления</label>

					<div className={styles.steps}>
						{steps.map((step, i) => (
							<div key={i} className={styles.stepRow}>
								<div className={styles.stepHeader}>
									<span className={styles.stepNumber}>
										Шаг {i + 1}
									</span>

									<button
										type="button"
										className={styles.removeBtn}
										onClick={() => removeStep(i)}
									>
										✕
									</button>
								</div>

								<textarea
									className={styles.textarea}
									placeholder="Описание шага"
									value={step.description}
									onChange={(e) =>
										handleStepChange(
											i,
											"description",
											e.target.value,
										)
									}
								/>

								<label className={styles.fileLabel}>
									Выбрать фото шага
									<input
										type="file"
										accept="image/*"
										className={styles.fileInput}
										onChange={(e) =>
											handleStepChange(
												i,
												"image",
												e.target.files[0],
											)
										}
									/>
								</label>

								{step.image && (
									<FilePreview
										file={step.image}
										type="image"
										onRemove={() =>
											handleStepChange(i, "image", null)
										}
									/>
								)}

								{/* если редактирование и есть старая картинка */}
								{!step.image && step.image_url && (
									<FilePreview
										url={`http://fitnessfly.local/images${step.image_url}`}
										name={step.image_url.split("/").pop()}
										type="image"
										onRemove={() =>
											handleStepChange(
												i,
												"image_url",
												null,
											)
										}
									/>
								)}

							</div>
						))}
					</div>

					<button
						type="button"
						className={styles.addIngredientBtn}
						onClick={addStep}
					>
						+ Добавить шаг
					</button>
				</div>

				{error && <div className={styles.error}>{error}</div>}

				<button className={styles.button}>
					{isEdit ? "Сохранить" : "Создать"}
				</button>
			</form>
		</div>
	);
}

export default AdminCreateRecipe;
