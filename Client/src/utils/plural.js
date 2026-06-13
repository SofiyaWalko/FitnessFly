/**
 * Склонение существительного по числу (русский язык).
 *
 * @param {number} count — число
 * @param {[string, string, string]} forms — [1 день, 2 дня, 5 дней]
 * @returns {string} нужная форма слова
 *
 * Пример: pluralize(5, ["день", "дня", "дней"]) // "дней"
 */
export function pluralize(count, forms) {
	const n = Math.abs(Number(count)) % 100;
	const n1 = n % 10;

	if (n > 10 && n < 20) return forms[2];
	if (n1 > 1 && n1 < 5) return forms[1];
	if (n1 === 1) return forms[0];

	return forms[2];
}

/**
 * Возвращает строку "N день / дня / дней".
 */
export function daysLabel(count) {
	return `${count} ${pluralize(count, ["день", "дня", "дней"])}`;
}
