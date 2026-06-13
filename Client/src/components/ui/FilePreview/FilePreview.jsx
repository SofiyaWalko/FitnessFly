import { useEffect, useState } from "react";
import styles from "./filepreview.module.css";

/**
 * Превью загруженного файла (картинка/видео) с названием и кнопкой удаления.
 *
 * props:
 *  - file: File (только что выбранный файл) — необязательно
 *  - url: string (уже сохранённый файл при редактировании) — необязательно
 *  - name: подпись (если не передана — берётся из file.name / из url)
 *  - type: "image" | "video"
 *  - onRemove: () => void
 */
function FilePreview({ file, url, name, type = "image", onRemove }) {
	const [objectUrl, setObjectUrl] = useState(null);

	useEffect(() => {
		if (file) {
			const u = URL.createObjectURL(file);
			setObjectUrl(u);
			return () => URL.revokeObjectURL(u);
		}
		setObjectUrl(null);
	}, [file]);

	const src = objectUrl || url;
	if (!src) return null;

	const label =
		name || (file && file.name) || (url ? url.split("/").pop() : "");

	return (
		<div className={styles.preview}>
			<div className={styles.thumbWrap}>
				{type === "video" ? (
					<video className={styles.thumb} src={src} muted />
				) : (
					<img className={styles.thumb} src={src} alt={label} />
				)}
			</div>

			<span className={styles.name}>{label}</span>

			{onRemove && (
				<button
					type="button"
					className={styles.removeBtn}
					onClick={onRemove}
				>
					✕
				</button>
			)}
		</div>
	);
}

export default FilePreview;
