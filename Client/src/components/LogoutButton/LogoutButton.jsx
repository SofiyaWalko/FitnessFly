import { useNavigate } from "react-router-dom";
import closeIcon from "@assets/images/close.svg";
import styles from "./logoutbutton.module.css";

function LogoutButton() {
	const navigate = useNavigate();

	function logout() {
		localStorage.removeItem("user_id");
		localStorage.removeItem("role");

		navigate("/");

		window.location.reload();
	}

	return (
		<button onClick={logout} className={styles.logoutbutton}>
			<img src={closeIcon} alt="close" />
		</button>
	);
}

export default LogoutButton;
