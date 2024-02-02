import React, {useEffect, useState} from 'react';
import './login.css'
import logo from '../../assets/images/home.png'
import google_logo from '../../assets/images/solid-brands-google-alt.png'
import {Link, useLocation} from 'react-router-dom';
import {ApiService} from '../../services/apiService'

const Login: React.FC = () => {
    const location = useLocation();
    const req = new ApiService()
    useEffect(() => {
        document.title = `Chat App - ${location.pathname.slice(1)}`;
    }, [location]);


    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (userData: { email: string; password: string }) => {
        try {
            const response = await req.login('/users/login/', userData);
            if(response.success){
                window.sessionStorage.setItem('token', response.token)
                window.sessionStorage.setItem('authUser', JSON.stringify(response.user))
                window.location.href = '/';
            }else {
                alert(response.error.non_field_errors[0])
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(formData)
        setFormData({
            email: '',
            password: '',
        });
    };

    return (

        <div className="main">

            <div className="main-container">
                <div className="heading">
                    <img src={logo} alt="" />
                        <span>Home</span>
                </div>

                <div className="form-container">
                    <div className="form-container-heading">
                        <p className="p-1"> 👋 Welcome back</p>
                        <p className="p-2">Login to your account</p>
                    </div>

                    <a href="https://google.com">
                        <div className="google-sign-in">
                            <img src={google_logo} alt="" />
                                <p> Continue with Google</p>
                        </div>
                    </a>

                    <div className="break"/>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-field">
                                <label htmlFor="email" className="label">Email</label>
                                <input type="email" name="email" id="email" placeholder="assessment@gmail.com" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="password" className="label">Password</label>

                                <input type="password" name="password" id="password" placeholder="******" required value={formData.password} onChange={handleChange} />
                            </div>
                            <Link to={'/signup'} className="forgot-password">
                                Forgot Password
                            </Link>
                        </div>
                        <button type="submit" className="sign-up-button">Log In</button>
                    </form>
                </div>
            </div>
        </div>


    );
};

export default Login;