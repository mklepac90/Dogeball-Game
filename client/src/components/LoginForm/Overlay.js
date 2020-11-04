import React from 'react'
import StyledOverlay, { InnerLogin, InnerSignup } from './styled/StyledOverlay'
import { STATE_LOG_IN } from './useToggle'

const WelcomeOverlay = () => (
  <InnerLogin className="inner">
    <h1  className="form-titles">Welcome Back!</h1>
    <p className="form-contents">To keep connected with us please login with your personal info</p>
  </InnerLogin>
)

const NewOverlay = () => (
  <InnerSignup className="inner">
    <h1 className="form-titles">Hello, Friend!</h1>
    <p className="form-contents">Enter your details below to start your journey with us</p>
  </InnerSignup>
)

const Overlay = ({ toggleMode, mode }) => (
  <StyledOverlay className="overlay">
    <WelcomeOverlay />
    <NewOverlay />
    <button onClick={toggleMode}>
      <span>{mode === STATE_LOG_IN ? 'Sign in' : 'Sign up'}</span>
    </button>
  </StyledOverlay>
)

export default Overlay
