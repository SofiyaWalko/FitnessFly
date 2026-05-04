import styles from "./adminprogramcard.module.css";
import ButtonGray from "../Landing/ButtonGray";

import icon_calender from "../../assets/images/icon_calender.svg";
import icon_level from "../../assets/images/icon_level.svg";

function AdminProgramArchiveCard({
	program,
	onRestore,
	onDeleteForever,
}) {
	function handleRestore(e) {
		e.stopPropagation();
		onRestore(program.id);
	}

	function handleDelete(e) {
		e.stopPropagation();
		onDeleteForever(program.id);
	}

	return (
		<div className={styles.container}>
			<img
				className={styles.imgProgram}
				src={program.image_url}
				alt={program.title}
			/>

			<div className={styles.info}>
				<div className={styles.calender}>
					<img src={icon_calender} />
					<span>{program.duration_days} дней</span>
				</div>

				<div className={styles.level}>
					<img src={icon_level} />
					<span>{program.difficulty_level}</span>
				</div>
			</div>

			<h4>{program.title}</h4>

			<div className={styles.buttonWrapper}>
				<ButtonGray text="Восстановить" onClick={handleRestore} className={styles.primary}/>
				<ButtonGray text="Удалить навсегда" onClick={handleDelete} />
			</div>
		</div>
	);
}

export default AdminProgramArchiveCard;