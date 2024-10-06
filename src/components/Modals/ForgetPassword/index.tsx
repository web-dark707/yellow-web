import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Overlay } from '@/components/vip-ui';
import './index.scss';
import { useSetForgotPasswordState } from '@/store/common/hooks';
import { selectorForgotPasswordState } from '@/store/common/selectors';
type ForgetPasswordModalProps = {};
const ForgetPasswordModal: FC<ForgetPasswordModalProps> = () => {
    const setIsShowForgotPasswordModal = useSetForgotPasswordState();
    const isShowForgotPasswordModal = useRecoilValue(
        selectorForgotPasswordState,
    );
    return (
        <Overlay
            visible={isShowForgotPasswordModal}
            closeIcon={<></>}
            onCancel={() => setIsShowForgotPasswordModal(false)}
        >
            <div className="login">
                <div>
                    <h2 className="title">重置密码</h2>
                </div>
                <div className="account">
                    <div className="account-info account-number">
                        <label>邮箱</label>
                        <input type="text" />
                    </div>
                </div>
                <button className="login-btn">发送</button>
            </div>
        </Overlay>
    );
};
export default ForgetPasswordModal;
