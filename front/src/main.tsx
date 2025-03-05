import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="1037634719253-s17gvuugf38vbjq2vak8vfibqqmk8gqb.apps.googleusercontent.com">
  <StrictMode>
    <App /> 
  </StrictMode>
  </GoogleOAuthProvider>
)
