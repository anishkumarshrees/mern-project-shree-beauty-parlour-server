import nodeMailer from 'nodemailer'
import envConfig from '../config/config'

interface IData{
    to : string,
    subject : string,
    text: string
}
const sendMail=async (data:IData)=>{
  const transporter =  nodeMailer.createTransport({
        service:'gmail',
        //company ko details halna paryo auth maa
        auth:{
            user : envConfig.email,
            //eha gmail ko password dini haina app password dini ho
            pass : envConfig.emailPassword
        }
    })

    const mailOptions ={
        from : "ShreeBeautyParlour<shreebeautyparolor@gmail.com>",
        to : data.to,
        subject : data.subject,
        text : data.text
    }
   try {
    await transporter.sendMail(mailOptions)
   } catch (error) {
    console.log(error)
   }
}

export default sendMail