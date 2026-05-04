import { useNavigate } from "react-router-dom";

import styles from "./adminrecipecard.module.css";
import ButtonGray from "../Landing/ButtonGray";
import Status_Category from "../Status_Category";

import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";

function AdminRecipeCard({
	id,
	title,
	category,
	points,
	image,
	calories,
	onDelete,
}) {
	const navigate = useNavigate();	

	function handleEdit() {
		navigate(`/adminpanel/recipes/edit/${id}`);
	}

	function handleDelete() {

		if (onDelete) {
			onDelete(id);
		}
	}

	return (
		<div className={styles.container}>
			<Status_Category text={category} color="#f3f3f3" />

			<img className={styles.imgRecipe} src={image} alt={title} />

			<div className={styles.info}>
				<div className={styles.kkal}>
					<img src={icon_kkal} alt="kkal" />
					<span>{calories} ккал</span>
				</div>

				<div className={styles.cost}>
					<img src={icon_cost} alt="cost" />
					<span>{Number(points) === 0 ? "Бесплатно" : points}</span>
				</div>
			</div>

			<h4>{title}</h4>

			<div className={styles.buttonWrapper}>
				<ButtonGray text="Редактировать" onClick={handleEdit} className={styles.primary} />
				<ButtonGray text="Удалить" onClick={handleDelete} />
			</div>
		</div>
	);
}

export default AdminRecipeCard;
