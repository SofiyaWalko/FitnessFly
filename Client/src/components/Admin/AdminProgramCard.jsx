import { useNavigate } from "react-router-dom";
import styles from "./adminprogramcard.module.css";
import ButtonGray from "../Landing/ButtonGray";
import icon_calender from "../../assets/images/icon_calender.svg"
import icon_level from "../../assets/images/icon_level.svg"

function AdminProgramCard({ id, title, days, level, image, onDelete }) {
	const navigate = useNavigate();

	function handleOpen() {
		navigate(`/adminpanel/programs/${id}`);
	}

	function handleEdit(e) {
		e.stopPropagation();
		navigate(`/adminpanel/programs/edit/${id}`);
	}

	function handleDelete(e) {
		e.stopPropagation();


		onDelete(id);
	}

	return (
		<div className={styles.container} onClick={handleOpen}>
			<img className={styles.imgProgram} src={image} alt={title} />

			<div className={styles.info}>
				<div className={styles.calender}>
					<img src={icon_calender} alt="days" />
					<span>{days} дней</span>
				</div>

				<div className={styles.level}>
					<img src={icon_level} alt="level" />
					<span>{level}</span>
				</div>
			</div>

			<h4>{title}</h4>

			<div className={styles.buttonWrapper}>
				<ButtonGray text="Редактировать" onClick={handleEdit} className={styles.primary}/>
				<ButtonGray text="Удалить" onClick={handleDelete} />
			</div>
		</div>
	);
}

export default AdminProgramCard;