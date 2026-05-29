import ButtonGray from "@components/ui/ButtonGray/ButtonGray";
import styles from "./sectiontitle.module.css";

function SectionTitle({ title, viewAllLink, showViewAll = true }) {
	return (
		<div className={styles.title}>
			<h2>{title}</h2>
			{showViewAll && <ButtonGray text="Смотреть все" to={viewAllLink} />}
		</div>
	);
}

export default SectionTitle;
