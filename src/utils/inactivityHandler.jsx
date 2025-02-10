import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

let inactivityTimeout;
let notificationTimeout;

const resetInactivityTimeout = (redirectToLogin) => {
    clearTimeout(inactivityTimeout);
    clearTimeout(notificationTimeout);

    // Set timeout for showing notification 2 minutes before session expiry
    notificationTimeout = setTimeout(() => {
        toast.warning('Your session will expire in 2 minutes. Please save your work.', {
            position: "top-right",
            autoClose: 120000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }, 3 * 60 * 1000); // 3 minutes

    inactivityTimeout = setTimeout(() => {
        redirectToLogin();
    }, 5 * 60 * 1000); // 5 minutes
};

const setupInactivityHandler = (redirectToLogin) => {
    window.onload = () => resetInactivityTimeout(redirectToLogin);
    document.onmousemove = () => resetInactivityTimeout(redirectToLogin);
    document.onkeypress = () => resetInactivityTimeout(redirectToLogin);
};

const InactivityHandler = ({ children }) => {
    const navigate = useNavigate();

    const redirectToLogin = () => {
        // Clear user session data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActive');
        localStorage.removeItem('redirectUrl');
        navigate("/login");
    };

    useEffect(() => {
        setupInactivityHandler(redirectToLogin);
    }, [navigate]);

    return children;
};

export default InactivityHandler;