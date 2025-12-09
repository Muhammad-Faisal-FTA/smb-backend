import { transporter } from "./Email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./EmailTemplate.js";

// Send verification code email imported in auth.controller.js to send verification email after user registration.
export const sendVerificationEmail=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: `"FinancePulse" <${process.env.EMAIL_USER}>`,

            to: email, // list of receivers
            subject: "Verify your Email for FinancePulse", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template(verificationCode)
        })
        console.log('Email send Successfully', verificationCode)
    } catch (error) {
        console.log('Email error is:',error.message)
    }
}

// Send welcome email imported in auth.service.js to send welcome email after email verification.
export const sendWelcomeEmail=async(email,fullName)=>{
    try {
     const response=   await transporter.sendMail({
            from: `"FinancePulse" <${process.env.EMAIL_USER}>`,

            to: email, // list of receivers
            subject: "Welcome To FinancePulse", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",fullName)
        })
        console.log('Welcome Email sent Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}

