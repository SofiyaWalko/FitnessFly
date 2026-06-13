import styles from "./normitem.module.css";


function NormItem({name, count, unit, note}) {
	return (
        <div className={styles.norm_item}>
            <span className={styles.name}>{name}</span>
            <div className={styles.count_note}>
                <div className={styles.count_item}>
                    <span className={styles.count}>{count}</span>
                    <span className={styles.unit}>{unit}</span>
                </div>
                <span className={styles.note}>{note}</span> 
            </div>                       		
        </div>
	);
}

export default NormItem;
