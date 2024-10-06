import React, { lazy, FC, useEffect } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { WrapperRouteComponent } from './config';
import Redirect from './Redirect';

NProgress.configure({ showSpinner: false });
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));

const Home = lazy(() => import('@/pages/Home'));
const Player = lazy(() => import('@/pages/Player'));
const Pay = lazy(() => import('@/pages/Pay'));
const User = lazy(() => import('@/pages/User'));

const NotAuthority = lazy(() => import('@/components/ResultPage/NotAuthority'));
const NotFound = lazy(() => import('@/components/ResultPage/NotFound'));
const routeList: RouteObject[] = [
    {
        path: '/',
        element: <Redirect to="/home" />,
    },
    {
        path: '/home',
        element: (
            <WrapperRouteComponent
                element={<Home />}
                isMotion={false}
                navBar
                tabBar
            />
        ),
    },
    // {
    //     path: '/register',
    //     element: (
    //         <WrapperRouteComponent
    //             element={<Register />}
    //             auth={false}
    //             navBar={false}
    //             isMotion={false}
    //             title="注册"
    //         />
    //     ),
    // },
    {
        path: '/player',
        element: (
            <WrapperRouteComponent
                element={<Player />}
                isMotion={false}
                navBar
            />
        ),
    },
    // {
    //     path: '/login',
    //     element: (
    //         <WrapperRouteComponent
    //             element={<Login />}
    //             auth={false}
    //             navBar={false}
    //             isMotion={false}
    //             title="登入"
    //         />
    //     ),
    // },
    {
        path: '/pay',
        element: <WrapperRouteComponent element={<Pay />} title="充值" />,
    },
    {
        path: '/user',
        element: <WrapperRouteComponent element={<User />} title="个人中心" />,
    },
    {
        path: '*',
        element: (
            <WrapperRouteComponent
                element={<NotFound />}
                auth={false}
                navBar={false}
            />
        ),
    },
    {
        path: '/403',
        element: (
            <WrapperRouteComponent
                element={<NotAuthority />}
                auth={false}
                navBar={false}
            />
        ),
    },
];

const RenderRouter: FC = () => {
    useEffect(() => {
        NProgress.done();
        return () => {
            NProgress.start();
        };
    });
    return useRoutes(routeList);
};

export default RenderRouter;
