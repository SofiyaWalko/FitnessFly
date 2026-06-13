import { Link } from "react-router-dom";
import styles from "./programcard.module.css";
import icon_calender from "@assets/images/icon_calender.svg";
import icon_level from "@assets/images/icon_level.svg";
import Status_Category from "@/components/ui/StatusCategory/StatusCategory";
import { daysLabel } from "@/utils/plural";

function ProgramCard({ id, title, days, level, image, status }) {
	return (
		<div className={styles.container}>
			<Link className={styles.linkProgram} to={`/program/${id}`}>
				{status && <Status_Category text={status} color="#f3f3f3" />}

				<img className={styles.imgProgram} src={image} alt={title} />

				<div className={styles.info}>
					<div className={styles.calender}>
						<img src={icon_calender} alt="days" />
						<span>{daysLabel(days)}</span>
					</div>

					<div className={styles.level}>
						<img src={icon_level} alt="level" />
						<span>{level}</span>
					</div>
				</div>

				<h4>{title}</h4>
			</Link>
		</div>
	);
}

export default ProgramCard;
