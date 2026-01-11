import ReactDOM from 'react-dom';

const Alert = ({ children }) => {
    return ReactDOM.createPortal(
        <div className='absolute top-0 m-0 p-0 overflow-hidden w-screen h-screen backdrop-brightness-[0.35] flex justify-center items-center'>
            <div>{children}</div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Alert;