import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Overlay } from '@/components/vip-ui';
import './index.scss';
import { useSetRegisterState } from '@/store/common/hooks';
import { selectorRegisterState } from '@/store/common/selectors';
type RegisterModalProps = {};

const RegisterModal: FC<RegisterModalProps> = () => {
    const setIsShowRegisterModal = useSetRegisterState();
    const isShowRegisterModal = useRecoilValue(selectorRegisterState);
    return (
        <Overlay
            visible={isShowRegisterModal}
            onCancel={() => setIsShowRegisterModal(false)}
            closeIcon={<></>}
        >
            <div className="login">
                <div>
                    <h2 className="title">注册一个新帐户</h2>
                    <p className="register">
                        或
                        <a
                            onClick={() => {}}
                            href="#"
                            className="font-medium text-nord13 hover:text-nord8 focus:outline-none focus:underline"
                        >
                            登入你的帐户
                        </a>
                    </p>
                </div>
                <div className="account">
                    <div className="account-info account-number">
                        <label>邮箱</label>
                        <input type="text" />
                    </div>
                    <div className="account-info pwd-number">
                        <label>账号</label>
                        <input type="text" />
                    </div>
                </div>

                <div className="account">
                    <div className="account-info account-number">
                        <label>密码</label>
                        <input type="text" autoComplete="new-password" />
                    </div>
                    <div className="account-info pwd-number">
                        <label>确认密码</label>
                        <input type="password" autoComplete="new-password" />
                    </div>
                </div>
                <button className="login-btn">注册</button>
            </div>
        </Overlay>
    );
};
export default RegisterModal;
