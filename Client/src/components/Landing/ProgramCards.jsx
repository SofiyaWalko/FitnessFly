import styles from "./programcards.module.css"
import ProgramCard from "../Programs/ProgramCard"
import ButtonGray from "./ButtonGray"
import { useEffect, useState } from "react"

function ProgramCards() {

    const [programs, setPrograms] = useState([])

    useEffect(() => {

        fetch("https://fitnessfly.local/api/landing/getPrograms.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        })
        .then(res => {
            if (!res.ok) throw new Error("Ошибка загрузки программ")
            return res.json()
        })
        .then(data => {
            setPrograms(data)
        })
        .catch(err => {
            console.error(err)
        })

    }, [])

	return (
        <section className={styles.programs}>
            <div className={styles.container}>   

                <div className={styles.title}>
                    <h2>Готовые программы под любую цель</h2>
                    <ButtonGray text="Смотреть все" to="/programs"/>
                </div>

                <div className={styles.programcards}>

                    {programs.map(program => (
                        <ProgramCard
                            key={program.id}
                            id={program.id}
                            title={program.title}
                            days={program.duration_days}
                            level={program.difficulty_level}
                            image={program.image_url}
                            status={program.status}
                        />
                    ))}

                </div>                     

            </div>
        </section>         
    )
}

export default ProgramCards