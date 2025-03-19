import { Auth0Provider, AppState, User } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
}

const Auth0ProviderWithNav = ({children}: Props) => {
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const redirectURL = import.meta.env.VITE_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    if(!domain || !clientID || !redirectURL || !audience){
        throw new Error("unable to initialize the auth");
    }

    const onRedirectCallback = (appState?: AppState, user?: User) => {
        console.log("USER: ", user);
        console.log("Appstate: ", appState);
        navigate(appState?.returnTo || "/auth-callback");
    }

    return (
        <Auth0Provider 
            domain={domain} 
            clientId={clientID} 
            authorizationParams={{
                redirect_uri: redirectURL,
                audience,
            }}
            onRedirectCallback={onRedirectCallback}
        > 
        {children}
        </Auth0Provider>
    )
}

export default Auth0ProviderWithNav