import React, { useState, ReactNode, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { nextTick, isAndroid } from '@/utils/tools';
import { BasicInputProps } from '@/types/vip-ui/input';
import { formatAmount, reverseFormatAmount } from '@/common/format';

export type InputEleType = HTMLInputElement | HTMLTextAreaElement;

export function useInputLogic(
    props: BasicInputProps<InputEleType>,
    inputRef: React.MutableRefObject<InputEleType | null>,
) {
    const {
        value,
        defaultValue,
        validator,
        onChange,
        onInput,
        className,
        style,
        type = 'text',
        blurBeforeFocus,
        onKeyDown,
        onPressEnter,
        onFocus,
        onBlur,
        onClick,
        prefixDom,
        suffixDom,
        isClear = true,
        onClear,
        autoFocus,
        isAmount = false,
    } = props;
    const [inputValue, setInputValue] = useState(value || defaultValue || '');
    const [isFocusing, setIsFocusing] = useState(false);
    const [inputType, setInputType] = useState(type);
    const shouldPreventEvent = useRef(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value);
        }
    }, [value]);

    // 自动聚焦
    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => {
                inputRef.current && inputRef.current.focus();
            }, 200);
        }
    }, [autoFocus, inputRef]);

    function changeValue(nowValue: string, callback = () => {}) {
        if (nowValue && validator) {
            if (typeof validator === 'function') {
                if (!validator(nowValue)) {
                    return;
                }
            } else if (!validator.test(nowValue)) {
                return;
            }
        }
        const newInputValue = isAmount ? formatAmount(nowValue) : nowValue;
        setInputValue(newInputValue);
        callback();
    }

    function handleChange(e: React.ChangeEvent<InputEleType>) {
        const newValue = isAmount
            ? reverseFormatAmount(e.target.value)
            : e.target.value;
        changeValue(newValue, () => {
            onChange && onChange(e, newValue);
        });
    }

    function handleInput(e: any) {
        const newValue = isAmount
            ? reverseFormatAmount(e.target.value)
            : e.target.value;
        changeValue(newValue, () => {
            onInput && onInput(e, newValue);
        });
    }

    function handleKeyDown(e: React.KeyboardEvent<InputEleType>) {
        if (e.keyCode === 13) {
            onPressEnter && onPressEnter(e);
        }
        onKeyDown && onKeyDown(e);
    }

    function handleFocus(e: React.FocusEvent<InputEleType>) {
        nextTick(() => {
            if (shouldPreventEvent.current) {
                shouldPreventEvent.current = false;
                return;
            }
            setIsFocusing(true);
            onFocus && onFocus(e);
        });
    }

    function handleBlur(e: React.FocusEvent<InputEleType>) {
        nextTick(() => {
            if (shouldPreventEvent.current) {
                return;
            }
            setIsFocusing(false);

            onBlur && onBlur(e);
        });
    }

    function handleClick(e: React.MouseEvent<InputEleType>) {
        // 安卓才会有键盘切换不过来的问题，ios不开启此项，因为blur之后不能再自动focus
        if (blurBeforeFocus && isAndroid() && !isFocusing) {
            inputRef.current && inputRef.current.blur();
            nextTick(() => {
                inputRef.current && inputRef.current.focus();
            });
        } else {
            inputRef.current && inputRef.current.focus();
        }
        onClick && onClick(e);
    }

    function handleClear(e) {
        changeValue('', () => {
            onClear && onClear(e);
            onInput && onInput(e, '');
            if (isFocusing) {
                inputRef.current && inputRef.current.focus();
            }
        });
    }

    //处理光标
    const inputFocusing = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
        if (isFocusing) {
            if (inputRef.current) {
                inputRef.current.focus();
                setTimeout(() => {
                    inputRef.current.selectionEnd = inputValue.length;
                    inputRef.current.selectionStart = inputValue.length;
                }, 0);
            }
        }
    };

    // 处理前缀
    const PrefixNode = () => {
        return (
            prefixDom && (
                <div
                    className={classNames({
                        'opacity-70': !isFocusing && !inputValue,
                    })}
                >
                    {prefixDom}
                </div>
            )
        );
    };

    // 处理后缀
    const SuffixNode = () => {
        if (type !== 'password') {
            return <>{suffixDom}</>;
        }
        return (
            <img
                src={
                    inputType === 'password'
                        ? require(`assets/images/icon/form/unsee.png`)
                        : require(`assets/images/icon/form/see.png`)
                }
                className={classNames('w-22px h-22px ml-8px', {
                    'opacity-70': !isFocusing && !inputValue,
                })}
                onClick={() => {
                    inputFocusing();
                }}
            />
        );
    };

    // 处理clear icon
    const ClearNode = () => {
        return (
            inputValue && (
                <img
                    src={require('@/assets/images/icon/form/close.png')}
                    onClick={handleClear}
                    className={classNames('w-1em', {
                        'opacity-70': !isFocusing && !inputValue,
                    })}
                />
            )
        );
    };

    // 处理input border,字体,背景
    const InputStyle = () => {
        const style = {
            'border-primaryColor border border-solid text-baseColor':
                isFocusing,
            'text-baseColor opacity-70': !isFocusing && !inputValue,
        };

        return style;
    };

    function renderWrapper(children: ReactNode) {
        return (
            <div className="w-full h-full" style={style} ref={wrapRef}>
                <div
                    className={classNames(
                        `flex-row-start-center relative w-full`,
                        InputStyle(),
                        className,
                    )}
                >
                    <PrefixNode />
                    {children}
                    {isClear && inputValue && <ClearNode></ClearNode>}
                    <SuffixNode />
                </div>
            </div>
        );
    }
    return {
        inputValue,
        handleChange,
        handleInput,
        handleKeyDown,
        handleFocus,
        handleBlur,
        handleClick,
        renderWrapper,
        wrapRef,
        inputType,
    };
}
