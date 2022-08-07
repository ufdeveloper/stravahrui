import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    setIsLoading(true);
    let url = 'https://www.strava.com/oauth/authorize?client_id=54157&response_type=code&redirect_uri=https://httpbin.org/get&approval_prompt=auto&scope=read,read_all,profile:read_all,activity:read,activity:read_all&state=private';
    console.log('url=' + url);
    history.push(url);
    // fetch(url, {
    //   method: 'GET',
    // })
    //   .then((res) => {
    //     console.log('res=' + JSON.stringify(res));
    //     console.log('res.url after fetch = ' + res.url);
    //     setIsLoading(false);
    //     if (res.redirected) {
    //       console.log('res.url on redirect = ' + res.url);
    //       // const expirationTime = new Date(
    //       //     new Date().getTime() + +data.expiresIn * 1000
    //       // );
    //       // authCtx.login(data.idToken, expirationTime.toISOString());
    //       history.replace('/');
    //     } else {
    //       // todo - handle error in fragment instead of body
    //       return res.json().then((data) => {
    //         let errorMessage = 'Authentication failed!';
    //         // if (data && data.error && data.error.message) {
    //         //   errorMessage = data.error.message;
    //         // }
    //
    //         throw new Error(errorMessage);
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     alert(err.message);
    //   });
  };

  return (
    // <section className={classes.auth}>
    //   <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
    //   <form onSubmit={submitHandler}>
    //     <div className={classes.control}>
    //       <label htmlFor='email'>Your Email</label>
    //       <input type='email' id='email' required ref={emailInputRef} />
    //     </div>
    //     <div className={classes.control}>
    //       <label htmlFor='password'>Your Password</label>
    //       <input
    //         type='password'
    //         id='password'
    //         required
    //         ref={passwordInputRef}
    //       />
    //     </div>
    //     <div className={classes.actions}>
    //       {!isLoading && (
    //         <button>{isLogin ? 'Login' : 'Create Account'}</button>
    //       )}
    //       {isLoading && <p>Sending request...</p>}
    //       <button
    //         type='button'
    //         className={classes.toggle}
    //         onClick={switchAuthModeHandler}
    //       >
    //         {isLogin ? 'Create new account' : 'Login with existing account'}
    //       </button>
    //     </div>
    //   </form>
    // </section>
      <div>
        <a href={'https://www.strava.com/oauth/authorize?client_id=54157&response_type=code&redirect_uri=http://localhost:3000/oauth/callback&approval_prompt=auto&scope=read,read_all,profile:read_all,activity:read,activity:read_all&state=private'}>Connect to Strava</a>
      </div>
  );
};

export default AuthForm;
