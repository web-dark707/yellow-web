import React, { PropsWithChildren, ReactElement, Fragment } from 'react';
import Iframe from '../Iframe';
import LoginModal from '../Modals/Login';
import RegisterModal from '../Modals/Register';
import ForgetPasswordModal from '../Modals/ForgetPassword';

type WarpCommonProps = {};

export const WarpCommon = ({
    children,
}: PropsWithChildren<WarpCommonProps>) => {
    return (
        <Fragment>
            {children as ReactElement}
            {/* Iframe */}
            <Iframe></Iframe>
            <LoginModal />
            <RegisterModal />
            <ForgetPasswordModal />
        </Fragment>
    );
};

export default WarpCommon;
