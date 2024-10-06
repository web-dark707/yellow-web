import React, {
    PropsWithChildren,
    ReactElement,
    Fragment,
    useEffect,
    useCallback,
} from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation } from '@tanstack/react-query';
import { selectorTokenInfoState } from '@/store/user/selectors';
import {
    selectorRegisterState,
    selectorLoginModalState,
} from '@/store/common/selectors';
import { getUserDetails } from '@/api/home';
import { useSetUserDetailState } from '@/store/user/hooks';
import Iframe from '../Iframe';
import LoginModal from '../Modals/Login';
import RegisterModal from '../Modals/Register';
import ForgetPasswordModal from '../Modals/ForgetPassword';

type WarpCommonProps = {};

export const WarpCommon = ({
    children,
}: PropsWithChildren<WarpCommonProps>) => {
    const { mutateAsync: mutateGetUserDetails } = useMutation(getUserDetails);
    const loginState = useRecoilValue(selectorTokenInfoState);

    const isShowRegisterModal = useRecoilValue(selectorRegisterState);
    const isShowLoginModal = useRecoilValue(selectorLoginModalState);
    const setUserDetailState = useSetUserDetailState();
    const getUserDetail = useCallback(async () => {
        if (loginState && loginState?.loginId) {
            const res = await mutateGetUserDetails({ id: loginState.loginId });
            if (res.code === 200) {
                setUserDetailState(res.data.record);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginState, mutateGetUserDetails]);

    useEffect(() => {
        getUserDetail();
    }, [getUserDetail]);

    return (
        <Fragment>
            {children as ReactElement}
            {/* Iframe */}
            <Iframe></Iframe>
            {isShowLoginModal && <LoginModal />}
            {isShowRegisterModal && <RegisterModal />}
            <ForgetPasswordModal />
        </Fragment>
    );
};

export default WarpCommon;
