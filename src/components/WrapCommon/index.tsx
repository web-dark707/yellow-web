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
import { getDictList, getUserDetails } from '@/api/home';
import { useSetUserDetailState } from '@/store/user/hooks';
import { useSetVideoCategoryState } from '@/store/config/hooks';
import Iframe from '../Iframe';
import LoginModal from '../Modals/Login';
import RegisterModal from '../Modals/Register';
import ForgetPasswordModal from '../Modals/ForgetPassword';

type WarpCommonProps = {};

export const WarpCommon = ({
    children,
}: PropsWithChildren<WarpCommonProps>) => {
    const loginState = useRecoilValue(selectorTokenInfoState);
    const isShowRegisterModal = useRecoilValue(selectorRegisterState);
    const isShowLoginModal = useRecoilValue(selectorLoginModalState);
    const setVideoCategoryState = useSetVideoCategoryState();
    const setUserDetailState = useSetUserDetailState();
    const { mutateAsync: mutateGetDictList } = useMutation(getDictList);
    const { mutateAsync: mutateGetUserDetails } = useMutation(getUserDetails);

    const getUserDetail = useCallback(async () => {
        if (loginState && loginState?.loginId) {
            const res = await mutateGetUserDetails({ id: loginState.loginId });
            if (res.code === 200) {
                setUserDetailState(res.data.record);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginState, mutateGetUserDetails]);

    const getDictDetail = useCallback(async () => {
        const res = await mutateGetDictList({
            dictType: 'video_type',
        });
        if (res.code === 200) {
            console.log(res.data.records);
            setVideoCategoryState(
                res.data.records.map((it) => ({
                    value: it.dictValue,
                    label: it.dictLabel,
                })),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mutateGetDictList]);

    useEffect(() => {
        getDictDetail();
    }, [getDictDetail]);

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
