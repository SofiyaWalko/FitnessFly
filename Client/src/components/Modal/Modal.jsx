import { useEffect } from "react";
import styles from "./modal.module.css";

function Modal({
	open,
	title,
	children,
	actions,
	onClose,
	onConfirm,
	confirmText = "Подтвердить",
	cancelText = "Отмена",
	variant = "default",
	width = "520px",
}) {
	useEffect(() => {
		if (!open) return;

		function handleKeyDown(e) {
			if (e.key === "Escape") {
				onClose?.();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				style={{ maxWidth: width }}
				onClick={(e) => e.stopPropagation()}
			>
				{title && <h3 className={styles.title}>{title}</h3>}

				<div className={styles.body}>{children}</div>

				<div className={styles.footer}>
					{variant === "confirm" && !actions ? (
						<>
							<button
								className={styles.primaryButton}
								onClick={onConfirm}
							>
								{confirmText}
							</button>
							<button
								className={styles.secondaryButton}
								onClick={onClose}
							>
								{cancelText}
							</button>
						</>
					) : actions ? (
						actions
					) : (
						<button
							className={styles.primaryButton}
							onClick={onClose}
						>
							Закрыть
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default Modal;
