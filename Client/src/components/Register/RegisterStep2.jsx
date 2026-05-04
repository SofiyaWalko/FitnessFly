import styles from "./registerform.module.css"

function RegisterStep2({formData,setFormData}){

function change(e){
setFormData({...formData,[e.target.name]:e.target.value})
}

function submit(){

if(!formData.gender){
alert("Выберите пол")
return
}

if(!formData.goal){
alert("Выберите цель")
return
}

if(!formData.activity){
alert("Выберите уровень активности")
return
}

fetch("http://fitnessfly.local/api/auth/register.php",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(formData)
})
.then(res=>res.json())
.then(data=>{

if(data.status==="success"){

localStorage.setItem("user_id",data.user_id)
window.location="/home"

}else{

alert(data.message)

}

})
.catch(()=>{
alert("Ошибка соединения с сервером")
})

}

return(

<>
<h2 className={styles.title}>
Расчёт суточной нормы калорий
</h2>

<div className={styles.grid}>

<div className={styles.field}>
<label>Пол</label>

<div className={styles.radioGroup}>

<label>
<input
type="radio"
name="gender"
value="female"
checked={formData.gender==="female"}
onChange={change}
/>
Женский
</label>

<label>
<input
type="radio"
name="gender"
value="male"
checked={formData.gender==="male"}
onChange={change}
/>
Мужской
</label>

</div>

</div>

<div></div>

<div className={styles.field}>
<label>Дата рождения</label>
<input
type="date"
name="birthday"
value={formData.birthday}
onChange={change}
/>
</div>

<div className={styles.field}>
<label>Рост, см</label>
<input name="height" value={formData.height} onChange={change}/>
</div>

<div className={styles.field}>
<label>Вес, кг</label>
<input name="weight" value={formData.weight} onChange={change}/>
</div>

<div className={styles.field}>
<label>Обхват груди, см</label>
<input name="chest" value={formData.chest} onChange={change}/>
</div>

<div className={styles.field}>
<label>Обхват талии, см</label>
<input name="waist" value={formData.waist} onChange={change}/>
</div>

<div className={styles.field}>
<label>Обхват бёдер, см</label>
<input name="hips" value={formData.hips} onChange={change}/>
</div>

<div className={styles.field}>
<label>Уровень активности</label>

<select name="activity" value={formData.activity} onChange={change}>
<option value="">Выберите уровень активности</option>
<option value="1">Сидячий образ жизни</option>
<option value="2">Небольшая активность</option>
<option value="3">Умеренная активность</option>
<option value="4">Высокая активность</option>
<option value="5">Очень высокая активность</option>
</select>

</div>

<div className={styles.field}>
<label>Цель</label>

<select name="goal" value={formData.goal} onChange={change}>
<option value="">Выберите цель</option>
<option value="Снижение веса">Снижение веса</option>
<option value="Поддержание веса">Поддержание веса</option>
<option value="Набор веса">Набор веса</option>
</select>

</div>

</div>

<button className={styles.button} onClick={submit}>
Зарегистрироваться
</button>

</>

)

}

export default RegisterStep2