import React, { lazy, FC, useEffect } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { WrapperRouteComponent } from './config';
import Redirect from './Redirect';

NProgress.configure({ showSpinner: false });

const Home = lazy(() => import('@/pages/Home'));
const Player = lazy(() => import('@/pages/Player'));
const Pay = lazy(() => import('@/pages/Pay'));
const User = lazy(() => import('@/pages/User'));
const Anchor = lazy(() => import('@/pages/Anchor'));

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
                tabBar
                navBar
            />
        ),
    },
    {
        path: '/anchor',
        element: (
            <WrapperRouteComponent
                element={<Anchor />}
                isMotion={false}
                tabBar
                navBar
            />
        ),
    },
    {
        path: '/register',
        element: (
            <WrapperRouteComponent
                element={<Home />}
                isMotion={false}
                navBar
                tabBar
            />
        ),
    },
    {
        path: '/player',
        element: (
            <WrapperRouteComponent
                tabBar
                element={<Player />}
                isMotion={false}
                navBar={false}
            />
        ),
    },
    {
        path: '/pay',
        element: <WrapperRouteComponent element={<Pay />} title="充值" />,
    },
    {
        path: '/user',
        element: (
            <WrapperRouteComponent tabBar element={<User />} title="个人中心" />
        ),
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
