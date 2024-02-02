import React, {useState} from 'react';
import './modal.css'
import {ApiService} from "../../services/apiService";
import { useNavigate } from 'react-router-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    // children: React.ReactNode;

}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
    });
    if (!isOpen) {
        return null;
    }

    const req = new ApiService()

    const createChats = async (userData: { email: string})=>{

        const response = await req.post('/chat/create-chat/', userData);
        if(response.success){
            onClose()
            navigate('/')
        }else{
            onClose()
            alert(response.error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createChats(formData);
        setFormData({
            email: '',
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <span className="invite-text">Invite a Person</span>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="form-field">
                            <label htmlFor="email" className="label">Email</label>
                            <input type="email" name="email" id="email" placeholder="E.g john@gmail.com" required value={formData.email} onChange={handleChange}/>
                        </div>
                        <div className="form-field">
                            <label htmlFor="username" className="label">Name (Optional) </label>
                            <input type="text" name="username" id="username" placeholder="John" />
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="close-button" onClick={onClose}>Cancel</button>
                        <button className="add-button" type="submit" >Add Person</button>
                        {/*{children}*/}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
