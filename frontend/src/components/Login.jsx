import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {useNavigate} from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import {client} from '../client';
import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
const Login = () => {
  const navigate=useNavigate();
  const responseGoogle = (response) => {
    if (!response.credential) return;
    // Decode the JWT token using jwt-decode
    const decodedToken = jwtDecode(response.credential);
    // Extract user information from the decoded token
    const { name, sub: googleId, picture: imageUrl } = decodedToken;

    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
       name,
       googleId,
       imageUrl,
    };

    client
      .createIfNotExists(doc)
      .then(() => {
        console.log('Document created successfully');
        navigate('/', { replace: true });
        localStorage.setItem('user', JSON.stringify(doc));
      })
      .catch((error) => {
        console.error('Error creating document:', error);
      });
  };

  
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
        src={shareVideo}
        type='video/mp4'
        loop
        controls={false}
        muted
        autoPlay
        className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className='p-5'>
            <img src={logo} width='150px' alt='logo'/>
          </div>
           <div className='shadow-2x1'>
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
            <GoogleLogin 
           // clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
            render={(renderprops)=>(
              <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderprops.onClick}
                  disabled={renderprops.disabled}
                >
               <FcGoogle className='mr-4'/>Sign in with Google
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            />
            </GoogleOAuthProvider>
            
           </div>
        </div>
      </div>
    </div>
  )
}

export default Login