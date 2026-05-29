import styles from "./statuscategory.module.css"

function Status_Category({text, color}) {
	return (
        <span className={styles.category} style={{ backgroundColor: color }}>{text}</span>
    );
}

export default Status_Category;
