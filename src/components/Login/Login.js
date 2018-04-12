import React from 'react'

import './Login.css';

export default function Login(props) {
  return (
    <div className="login-page">
      <div className="form">
        <form onSubmit={props.submit} className="login-form">
          <input data-test-id="firstName" type="text" required placeholder="First Name" onChange={props.input} />
          <input data-test-id="lastName" type="text" placeholder="Last Name" />
          <input data-test-id="email" type="email" required placeholder="Email" />
          <input data-test-id="password" type="password" required placeholder="password" />
          <button type="submit" data-test-id="submit">login</button>
        </form>
      </div>
    </div>
  )
}
