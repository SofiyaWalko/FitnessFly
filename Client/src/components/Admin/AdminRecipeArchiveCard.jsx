import styles from "./adminrecipecard.module.css";
import ButtonGray from "../Landing/ButtonGray";
import Status_Category from "../Status_Category";

import icon_kkal from "../../assets/images/icon_kkal.svg";
import icon_cost from "../../assets/images/icon_cost.svg";

function AdminRecipeArchiveCard({
	recipe,
	onRestore,
	onDeleteForever,
}) {
	function handleRestore(e) {
		e.stopPropagation();
		onRestore(recipe.id);
	}

	function handleDelete(e) {
		e.stopPropagation();
		onDeleteForever(recipe.id);
	}

	return (
		<div className={styles.container}>
			<Status_Category text={recipe.category} color="#f3f3f3" />

			<img className={styles.imgRecipe} src={recipe.image} />

			<div className={styles.info}>
				<div className={styles.kkal}>
					<img src={icon_kkal} />
					<span>{recipe.calories} ккал</span>
				</div>

				<div className={styles.cost}>
					<img src={icon_cost} />
					<span>
						{Number(recipe.points) === 0
							? "Бесплатно"
							: recipe.points}
					</span>
				</div>
			</div>

			<h4>{recipe.title}</h4>

			<div className={styles.buttonWrapper}>
				<ButtonGray text="Восстановить" onClick={handleRestore} className={styles.primary}/>
				<ButtonGray text="Удалить навсегда" onClick={handleDelete} />
			</div>
		</div>
	);
}

export default AdminRecipeArchiveCard;