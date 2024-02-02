import React, {useEffect, useState} from 'react';
import './sign_up.css';
import home_logo from '../../assets/images/home.png';
import { useLocation } from 'react-router-dom';
import {ApiService} from '../../services/apiService'


const SignUp: React.FC = () => {
    const location = useLocation();
    const req = new ApiService()
    useEffect(() => {
        document.title = `Chat App - ${location.pathname.slice(1)}`;
    }, [location]);


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignUp = async (userData: { username: string; email: string; password: string }) => {

        try {
            const response = await req.post('/users/sign-up/', userData);
            if(response.success){
                window.location.href = '/login';
            }else if(response.error?.non_field_errors){
                alert(response.error?.non_field_errors[0])
            }else {
                alert(response.error)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSignUp(formData);
        setFormData({
            username: '',
            email: '',
            password: '',
        });
    };


    return (
        <div className="main">
            <div className="main-container">
                <div className="heading">
                    <img src={home_logo} alt="" />
                        <span>Home</span>
                </div>

                <div className="form-container">
                    <div className="form-container-heading">
                        <p className="p-1">Sign Up</p>
                        <p className="p-2">Create an account</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-field">
                                <label htmlFor="username"> Username</label>
                                <input type="text" id="username" placeholder="John" required name="username" value={formData.username} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="email" className="label">Email</label>
                                <input type="text" id="email" placeholder="assessment@gmail.com" required name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="password" className="label">Password</label>
                                <input type="password" id="password" placeholder="******" required name="password" value={formData.password} onChange={handleChange} />
                            </div>
                            <a href="." className="forgot-password">Forgot Password</a>
                        </div>
                        <button type="submit" className="sign-up-button">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default SignUp;
