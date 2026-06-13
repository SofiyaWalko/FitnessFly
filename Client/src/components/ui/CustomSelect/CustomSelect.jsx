import { useEffect, useRef, useState } from "react";
import styles from "./customselect.module.css";

/**
 * Кастомный селект.
 *
 * props:
 *  - label: подпись над селектом (необязательно)
 *  - value: текущее значение
 *  - onChange: (value) => void
 *  - options: [{ value, label }]
 *  - placeholder: текст, когда ничего не выбрано
 *  - disabled
 */
function CustomSelect({
	label,
	value,
	onChange,
	options = [],
	placeholder = "Выберите",
	disabled = false,
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	const selected = options.find(
		(o) => String(o.value) === String(value ?? ""),
	);

	/* закрытие по клику вне */
	useEffect(() => {
		function handleClickOutside(e) {
			if (ref.current && !ref.current.contains(e.target)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	function selectOption(optValue) {
		onChange(optValue);
		setOpen(false);
	}

	return (
		<div
			ref={ref}
			className={`${styles.select} ${disabled ? styles.disabled : ""}`}
		>
			{label && <label className={styles.label}>{label}</label>}

			<button
				type="button"
				className={`${styles.trigger} ${open ? styles.open : ""}`}
				onClick={() => !disabled && setOpen((v) => !v)}
				disabled={disabled}
			>
				<span
					className={selected ? styles.value : styles.placeholder}
				>
					{selected ? selected.label : placeholder}
				</span>
				<span className={styles.arrow} />
			</button>

			{open && (
				<ul className={styles.dropdown} role="listbox">
					{options.map((opt) => (
						<li
							key={opt.value}
							role="option"
							aria-selected={
								String(opt.value) === String(value ?? "")
							}
							className={`${styles.option} ${
								String(opt.value) === String(value ?? "")
									? styles.optionActive
									: ""
							}`}
							onClick={() => selectOption(opt.value)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default CustomSelect;
