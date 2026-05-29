import { NavLink } from "react-router-dom";
import styles from "./tablitle.module.css";

function TabLitle({text }) {
	return (
        <NavLink
            
            className={({ isActive }) =>
                isActive ? `${styles.tabbig} ${styles.active}` : styles.tablitle
            }
        >
            {text}
        </NavLink>
    );
}

export default TabLitle;