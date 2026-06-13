import { useEffect, useRef, useState } from "react";
import styles from "./ingredientautocomplete.module.css";

/**
 * Поле ввода названия ингредиента с умным поиском по базе.
 * Пользователь может выбрать существующий ингредиент из подсказок
 * или ввести новый вручную.
 *
 * props:
 *  - value: текущее название
 *  - onChange: (value) => void                — изменение текста
 *  - onSelect: (ingredient) => void           — выбор из подсказок { name, quantity }
 *  - placeholder
 */
function IngredientAutocomplete({
	value,
	onChange,
	onSelect,
	placeholder = "Название",
}) {
	const [suggestions, setSuggestions] = useState([]);
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const inputRef = useRef(null);
	const skipNextFetch = useRef(false);

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

	/* поиск с дебаунсом */
	useEffect(() => {
		if (skipNextFetch.current) {
			skipNextFetch.current = false;
			return;
		}

		const query = (value || "").trim();
		if (query.length < 2) {
			setSuggestions([]);
			return;
		}

		const t = setTimeout(() => {
			fetch("http://fitnessfly.local/api/recipes/searchIngredients.php", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ q: query }),
			})
				.then((res) => res.json())
				.then((data) => {
					setSuggestions(Array.isArray(data) ? data : []);
					// открываем подсказки только если пользователь
					// действительно печатает в этом поле (оно в фокусе),
					// а не при предзаполнении на странице редактирования
					if (
						Array.isArray(data) &&
						data.length &&
						document.activeElement === inputRef.current
					) {
						setOpen(true);
					}
				})
				.catch(() => setSuggestions([]));
		}, 250);

		return () => clearTimeout(t);
	}, [value]);

	function handleSelect(item) {
		skipNextFetch.current = true;
		onSelect ? onSelect(item) : onChange(item.name);
		setOpen(false);
		setSuggestions([]);
	}

	return (
		<div ref={ref} className={styles.wrap}>
			<input
				ref={inputRef}
				className={styles.input}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				onFocus={() => suggestions.length && setOpen(true)}
				autoComplete="off"
			/>

			{open && suggestions.length > 0 && (
				<ul className={styles.dropdown}>
					{suggestions.map((item, i) => (
						<li
							key={i}
							className={styles.option}
							onClick={() => handleSelect(item)}
						>
							<span className={styles.optName}>{item.name}</span>
							{item.quantity && (
								<span className={styles.optQty}>
									{item.quantity}
								</span>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default IngredientAutocomplete;
