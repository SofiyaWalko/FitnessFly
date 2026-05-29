import { useState } from "react"
import RegisterStep1 from "./RegisterStep1"
import RegisterStep2 from "./RegisterStep2"
import styles from "./registerform.module.css"

function RegisterForm(){

const [step,setStep]=useState(1)

const [formData,setFormData]=useState({
name:"",
phone:"",
email:"",
password:"",
repeatPassword:"",
notify:"",
gender:"",
birthday:"",
goal:"",
weight:"",
waist:"",
chest:"",
hips:"",
height:"",
activity:""
})

return(

<div className={styles.container}>

{step===1 &&
<RegisterStep1
formData={formData}
setFormData={setFormData}
next={()=>setStep(2)}
/>
}

{step===2 &&
<RegisterStep2
formData={formData}
setFormData={setFormData}
/>
}

</div>

)

}

export default RegisterForm