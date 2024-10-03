import React from 'react';
import ReactDOM from 'react-dom/client';
import { AliveScope } from 'react-activation';
import VConsole from 'vconsole';
import { ENV_TYPE } from './config/error';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@/locales'; //国际化
import 'swiper/swiper.css';
import 'swiper/css/pagination';
import './assets/css/base.css';
import './assets/scss/global.scss';
import './assets/scss/windicss.scss';
import './virtual:windi.css';

if (Object.keys(ENV_TYPE).includes(window.location.host)) {
    const vConsole = new VConsole();
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);
root.render(
    <AliveScope>
        <App />
    </AliveScope>,
);

reportWebVitals();
