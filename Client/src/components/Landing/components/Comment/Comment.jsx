import styles from "./comment.module.css"
import star from "@assets/images/star.svg"

function Comment({ name, date, text, program, photo, rating }) {

	return (
		<div className={styles.commentcard}>
			<div className={styles.commentheader}>

                <div className={styles.info}>
                    <div className={styles.photo}>
					    <img src={photo} alt={name} />
				    </div>

				    <div className={styles.description}>
					    <span className={styles.name}>{name}</span>
					    <span className={styles.date}>{date}</span>
				    </div>
                </div>

				<div className={styles.stars}>
					{[...Array(rating)].map((_, i) => (
						<img key={i} src={star} alt="star" />
					))}
				</div>

			</div>

			<div className={styles.text}>
				<span>{text}</span>
			</div>

            <span className={styles.programname}>
                Программа: {program}
            </span>
		</div>
	)
}

export default Comment