import React, {
    PropsWithChildren,
    forwardRef,
    Ref,
    useRef,
    useImperativeHandle,
} from 'react';
import classNames from 'classnames';
import { ButtonProps, ButtonRef } from '@/types/vip-ui/button';
import { Loading } from '@/components/vip-ui';

const Button = forwardRef(
    (props: PropsWithChildren<ButtonProps>, ref: Ref<ButtonRef>) => {
        const {
            loading = false,
            disabled = false,
            disableWhenLoading = true,
            icon,
            showTextWhenLoading = true,
            style = {},
            className = '',
            children = null,
            loadingIcon,
            width = 'w-full',
            onClick,
            onClickDisabled,
            coverIconWhenLoading = true,
            background = 'button-gradient',
        } = props;
        const domRef = useRef<HTMLButtonElement | null>(null);

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        const renderIcon = () => {
            if (coverIconWhenLoading) {
                return loading ? null : icon;
            }
            return icon;
        };
        return (
            <button
                type="button"
                ref={domRef}
                style={style}
                className={classNames(
                    disabled && `${background} opacity-50`,
                    'flex-row-center text-[14px] text-[#fff] h-[44px] rounded-[2px] font-bold',
                    width,
                    background,
                    className,
                )}
                onClick={
                    disabled || (loading && disableWhenLoading)
                        ? onClickDisabled
                        : onClick
                }
                disabled={disabled}
            >
                {icon || loading ? (
                    <div className="flex-row-center mr-5px">
                        {renderIcon()}
                        {loading &&
                            (loadingIcon ? (
                                loadingIcon
                            ) : (
                                <Loading text="" size={14} />
                            ))}
                    </div>
                ) : null}
                {(!loading || (loading && showTextWhenLoading)) && children ? (
                    <div>{children}</div>
                ) : null}
            </button>
        );
    },
);

export default Button;
