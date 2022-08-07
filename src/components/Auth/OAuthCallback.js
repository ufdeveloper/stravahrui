import qs from 'qs';
import React, { useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

const OauthCallback = () => {

    const location = useLocation();
    const authCtx = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        console.log(location);
        let code = qs.parse(location.search, { ignoreQueryPrefix: true }).code;
        console.log('code = ' + code);

        // Fetch token from backend
        fetch('http://localhost:8080/api/v1/token', {
            method: 'POST',
            body: JSON.stringify({
                code: code,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.json().then((data) => {
                        let errorMessage = 'Failed to fetch token';
                        // if (data && data.error && data.error.message) {
                        //   errorMessage = data.error.message;
                        // }

                        throw new Error(errorMessage);
                    });
                }
            })
            .then((data) => {
                console.log('token response=' + JSON.stringify(data));
                const expirationTime = new Date(
                    new Date().getTime() + +data.expires_in * 1000
                );
                authCtx.login(data.access_token, expirationTime.toISOString());
                history.replace('/');
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    return (
        <div>
            <h1>Callback Page</h1>
        </div>
    );
};

export default OauthCallback;