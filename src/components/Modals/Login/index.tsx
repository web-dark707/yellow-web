import React, { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Overlay } from '@/components/vip-ui';
import './index.scss';
import Checkbox from '@/components/Checkbox';
import { selectorLoginState } from '@/store/common/selectors';
import { useSetLoginState } from '@/store/common/hooks';
type LoginModalProps = {};

const LoginModal: FC<LoginModalProps> = () => {
    const setIsShowLoginModal = useSetLoginState();
    const isShowLoginModal = useRecoilValue(selectorLoginState);
    const [checkState, setCheckState] = useState(false);
    return (
        <Overlay
            visible={isShowLoginModal}
            onCancel={() => setIsShowLoginModal(false)}
            closeIcon={<></>}
        >
            <div className="login">
                <div>
                    <h2 className="title">登入你的帐户</h2>
                    <p className="register">
                        或
                        <a
                            onClick={() => {}}
                            href="#"
                            className="font-medium text-nord13 hover:text-nord8 focus:outline-none focus:underline"
                        >
                            注册一个新帐户
                        </a>
                    </p>
                </div>
                <div className="account">
                    <div className="account-info account-number">
                        <label>账号</label>
                        <input type="text" />
                    </div>
                    <div className="account-info pwd-number">
                        <label>密码</label>
                        <input type="password" autoComplete="new-password" />
                    </div>
                </div>
                <div className="other">
                    <Checkbox
                        value={1}
                        checked={checkState}
                        label={'记住我'}
                        onChange={() => setCheckState(!checkState)}
                    />
                    <a href="#" onClick={() => {}}>
                        忘记密码?
                    </a>
                </div>
                <button className="login-btn">登入</button>
            </div>
        </Overlay>
    );
};
export default LoginModal;
