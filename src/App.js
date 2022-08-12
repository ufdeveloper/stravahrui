import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import OauthCallback from "./components/Auth/OAuthCallback";

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/oauth/callback'>
          <OauthCallback />
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
