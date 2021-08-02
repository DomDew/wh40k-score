// DEPENDENCIES
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// COMPONENTS
import FormPageBackround from './FormPageBackround'
import FormPageHeader from './FormPageHeader'
import FormPageSwitchLink from './FormPageSwitchLink'
import ErrorMessage from './ErrorMessage'

// UTILS
import useLocalStorage from '../utils/useLocalStorage'
import { login } from '../utils/login'

const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .required('Required')
  })

export default function Login(props) {
  const [linkClicked, setLinkClicked] = useState(props.location.fromLink)
  const [loginError, setLoginError] = useState(null)
  const { setItemWithExpiry } = useLocalStorage("access-token")

  const handleClick = () => {
    setLinkClicked(true)
  }

  const handleLogin = async (values, setSubmitting) => {
    setLoginError('')
    const hour = 3600000;
    try {
      const loginRes = await login(values.email, values.password)

      setItemWithExpiry(loginRes.accessToken, hour)
      props.history.push("/dashboard")
    } catch (error) {
      error.response.status === 401 ? setLoginError("Incorrect username or password!") : setLoginError("Something went wrong... please try again")
    }
    setSubmitting(false)
  }

  return (
    <div className="main-container">
      <FormPageBackround linkClicked={linkClicked} />
      <FormPageHeader linkClicked={linkClicked} 
        headerLineOne="Welcome" 
        headerLineTwo="back" 
        subheader="Log-in to see your scores" 
      />
      
      <motion.div 
        style={{position: 'relative', height: "50%"}}
        initial={linkClicked ? { visibility: false } : { opacity: 0 }}
        animate={linkClicked ? { visibility: true } : { opacity: 1 }}
        exit={linkClicked ? { visibility: false } : { opacity: 0 }}
        transition={linkClicked ? { duration: 0 } : { duration: 0.7 }}
      >
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleLogin(values, setSubmitting)
          }}
        >
          {({ values, errors, touched, handleChange, isSubmitting, handleBlur }) => (
            <Form className="logsignin-form">
              <div className="form-group">
              <ErrorMessage error={loginError} />
                {errors.email && touched.email ? (
                  <ErrorMessage error={errors.email} />
                ) : null}
                <Field 
                  name="email" 
                  className={errors.email && touched.email ? "form-input form-input-error" : "form-input"}
                  type="text"
                  value={values.email}
                  placeholder="email"
                  onChange={handleChange}
                  error={touched.email && errors.email}
                />
                {errors.password && touched.password ? (
                <ErrorMessage error={errors.password} />
                ) : null}
                <Field 
                  name="password"
                  className={errors.password && touched.password ? "form-input form-input-error" : "form-input"}
                  type="password"
                  value={values.password}
                  placeholder="password"
                  onChange={handleChange}
                  error={touched.password && errors.password}
                />
                <FormPageSwitchLink 
                  pText="Dont have an account? " 
                  linkText="Sign-up!"
                  path="/signup"
                  handleClick={handleClick}
                />
              </div>
              <button
                className="btn-main" 
                type="submit" disabled={isSubmitting || errors.email || errors.password}
              >
                {isSubmitting ? "Loading..." : "login"}
              </button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  )
}
