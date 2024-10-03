import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import classNames from 'classnames';
import { componentWrapper } from '@/utils/componentType';
import { InputProps, InputRef } from '@/types/vip-ui/input';
import { useInputLogic } from './hooks';

const Input = forwardRef((props: InputProps, ref: Ref<InputRef>): any => {
    const {
        id,
        name,
        maxLength,
        placeholder,
        readOnly,
        onKeyUp,
        onKeyPress,
        inputClass,
        inputStyle,
        nativeProps = {},
        autoComplete = 'off',
    } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
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
    } = useInputLogic(props as any, inputRef);

    //  把最外层元素，input元素暴露给父组件
    useImperativeHandle(ref, () => ({
        dom: wrapRef.current,
        input: inputRef.current,
    }));

    function renderInput() {
        return renderWrapper(
            <input
                {...nativeProps}
                id={id}
                name={name}
                maxLength={maxLength}
                placeholder={placeholder}
                readOnly={readOnly}
                autoComplete={autoComplete}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyUp={onKeyUp}
                onKeyPress={onKeyPress}
                ref={inputRef}
                className={classNames(
                    'w-full outline-none border-none placeholder-baseColor bg-transparent flex-1 h-full px-14px',
                    inputClass,
                )}
                style={inputStyle}
                value={inputValue}
                type={inputType}
                onChange={handleChange}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
            />,
        );
    }

    return renderInput();
});

const TextArea = forwardRef((props: InputProps, ref: Ref<InputRef>): any => {
    const {
        id,
        name,
        maxLength,
        placeholder,
        readOnly,
        inputClass,
        inputStyle,
        autoComplete = 'off',
    } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const {
        inputValue,
        handleChange,
        handleInput,
        handleKeyDown,
        handleFocus,
        handleBlur,
        handleClick,
        renderWrapper,
        wrapRef,
    } = useInputLogic(props as any, inputRef);

    //  把最外层元素，input元素暴露给父组件
    useImperativeHandle(ref, () => ({
        dom: wrapRef.current,
        input: inputRef.current,
    }));

    function renderInput() {
        return renderWrapper(
            <textarea
                id={id}
                name={name}
                maxLength={maxLength}
                placeholder={placeholder}
                readOnly={readOnly}
                autoComplete={autoComplete}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={classNames(
                    'w-full outline-none border-none placeholder-baseColor bg-transparent flex-1 h-full px-14px',
                    inputClass,
                )}
                style={inputStyle}
                value={inputValue}
                onChange={handleChange}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
            />,
        );
    }

    return renderInput();
});

const WrappedTextArea = componentWrapper(TextArea, 'Textarea');

/**
 * 输入框组件，支持添加前后缀。
 * @displayName Input
 */
export default componentWrapper(Input, 'Input', {
    TextArea: WrappedTextArea,
});
