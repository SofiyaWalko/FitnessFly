import styles from "./faq.module.css";
import FAQItem from "@components/Landing/components/FAQitem/FAQitem";
import SectionTitle from "@components/Landing/components/SectionTitle/SectionTitle";

function FAQ() {
	const questions = [
		{
			question: "С какой программы мне начать?",
			answer: "Начните с программы для новичков. Она поможет привыкнуть к нагрузке.",
		},
		{
			question: "Могу ли я целиться на снижение жира?",
			answer: "Да, для этого есть специальные программы и рекомендации по питанию.",
		},
		{
			question: "Сколько видео мне нужно делать в день?",
			answer: "Обычно достаточно 1–2 тренировок в день.",
		},
		{
			question: "Нужно ли следовать видео в определённом порядке?",
			answer: "Да, программы построены последовательно для лучшего результата.",
		},
		{
			question: "Подходит ли эта программа для девочек?",
			answer: "Да, платформа разработана специально для девушек.",
		},
		{
			question: "Стоит ли делать видео натощак?",
			answer: "Можно, но рекомендуется лёгкий перекус перед тренировкой.",
		},
		{
			question: "Это слишком сложно! Есть какие-нибудь советы?",
			answer: "Начинайте с лёгких программ и постепенно увеличивайте нагрузку.",
		},
	];

	return (
		<section className={styles.faq} id="faq">
			<div className={styles.container}>
				<SectionTitle
					title="Часто задаваемые вопросы"
					showViewAll={false}
				/>

				<div className={styles.list}>
					{questions.map((item, index) => (
						<FAQItem
							key={index}
							question={item.question}
							answer={item.answer}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default FAQ;
