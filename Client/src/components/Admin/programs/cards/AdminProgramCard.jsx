import { useNavigate } from "react-router-dom";
import styles from "./adminprogramcard.module.css";
import ButtonGray from "@components/ui/ButtonGray/ButtonGray";
import icon_calender from "@assets/images/icon_calender.svg";
import icon_level from "@assets/images/icon_level.svg";
import { daysLabel } from "@/utils/plural";

function AdminProgramCard({
	id,
	title,
	days,
	duration_days,
	level,
	difficulty_level,
	image,
	image_url,
	onDelete,
	onRestore,
	onDeleteForever,
	variant = "default",
}) {
	const navigate = useNavigate();
	const isArchive = variant === "archive";

	const finalDays = duration_days || days;
	const finalLevel = difficulty_level || level;
	const finalImage = image_url || image;

	function handleOpen() {
		if (!isArchive) {
			navigate(`/adminpanel/programs/${id}`);
		}
	}

	function handleEdit(e) {
		e.stopPropagation();
		navigate(`/adminpanel/programs/edit/${id}`);
	}

	function handleDelete(e) {
		e.stopPropagation();
		if (onDelete) {
			onDelete(id);
		}
	}

	function handleRestore(e) {
		e.stopPropagation();
		if (onRestore) {
			onRestore(id);
		}
	}

	function handleDeleteForever(e) {
		e.stopPropagation();
		if (onDeleteForever) {
			onDeleteForever(id);
		}
	}

	return (
		<div className={styles.container} onClick={handleOpen}>
			<img className={styles.imgProgram} src={finalImage} alt={title} />

			<div className={styles.info}>
				<div className={styles.calender}>
					<img src={icon_calender} alt="days" />
					<span>{daysLabel(finalDays)}</span>
				</div>

				<div className={styles.level}>
					<img src={icon_level} alt="level" />
					<span>{finalLevel}</span>
				</div>
			</div>

			<h4>{title}</h4>

			<div className={styles.buttonWrapper}>
				{isArchive ? (
					<>
						<ButtonGray
							text="Восстановить"
							onClick={handleRestore}
							className={styles.primary}
						/>
						<ButtonGray
							text="Удалить навсегда"
							onClick={handleDeleteForever}
						/>
					</>
				) : (
					<>
						<ButtonGray
							text="Редактировать"
							onClick={handleEdit}
							className={styles.primary}
						/>
						<ButtonGray text="Удалить" onClick={handleDelete} />
					</>
				)}
			</div>
		</div>
	);
}

export default AdminProgramCard;
