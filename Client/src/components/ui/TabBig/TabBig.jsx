import { NavLink } from "react-router-dom";
import styles from "./tabbig.module.css";

function TabBig({ link, text, badge }) {
	return (
        <NavLink
            to={link}
            end
            className={({ isActive }) =>
                isActive ? `${styles.tabbig} ${styles.active}` : styles.tabbig
            }
        >
            {text}

            {badge > 0 && (
				<span className={styles.badge}>
					{badge}
				</span>
			)}
            
        </NavLink>
    );
}

export default TabBig;