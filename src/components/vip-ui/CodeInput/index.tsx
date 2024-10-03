import React, {
    useRef,
    forwardRef,
    Ref,
    useImperativeHandle,
    PropsWithChildren,
    useState,
    useLayoutEffect,
} from 'react';
import classNames from 'classnames';
import { CodeInputRef, CodeInputProps } from '@/types/vip-ui/code-input';
import { removeDefaultBehavior } from '@/utils/tools';

const CodeInput = forwardRef(
    (props: PropsWithChildren<CodeInputProps>, ref: Ref<CodeInputRef>) => {
        const {
            className = '',
            length = 6,
            autoComplete = 'off',
            boxClassName = '',
            inputClassName = '',
            placeholder = '-',
            onFinish,
            onChange,
            validator,
            field,
        } = props;

        const domRef = useRef<HTMLDivElement | null>(null);
        const inputRef = useRef<HTMLInputElement[]>([]);
        const [currentFocus, setCurrentFocus] = useState(0);
        const [errorText, setErrorText] = useState('');
        const [codeArr, setCodeArr] = useState<string[]>(
            Array(length).fill(''),
        );

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        // 聚焦输入框
        const focusOn = (i = currentFocus) => {
            const element = inputRef.current[i];
            if (element) {
                element.focus();
                setCurrentFocus(i);
            }
        };

        const handleChange = async (e, i) => {
            const value = e.target.value.trim();
            if (codeArr[i] !== value && value) {
                focusOn(i + 1);
            }
            const newCode = [...codeArr];
            newCode[i] = value;
            const val = newCode.join('');
            onChange && onChange(val);
            // 输入完成 触发完成事件
            if (newCode.filter((it) => it).length === length) {
                if (onFinish) {
                    const errText = await onFinish(
                        field ? { [field]: val } : val,
                    );
                    if (errText) setErrorText(errText);
                }
            }
            setCodeArr(newCode);
            focusOn(i);
            if (value !== '') {
                focusOn(i + 1);
            }
        };

        const handleKeyDown = (e, i) => {
            switch (e.keyCode) {
                case 8: // 删除
                    if (e.target.value === '') {
                        focusOn(i - 1);
                    }
                    if (errorText) {
                        setErrorText('');
                    }
                    break;
                default:
                    // 输入完成
                    if (codeArr.filter((it) => it).length === length) {
                        removeDefaultBehavior(e);
                        break;
                    }
                    focusOn(i);
            }
        };

        const handleInput = (e, i) => {
            const value = e.target.value;
            if (value === '') {
                e.target.value = '';
                return;
            }
            if (value && validator) {
                if (typeof validator === 'function') {
                    if (!validator(value)) {
                        return;
                    }
                } else if (!validator.test(value)) {
                    return;
                }
            }
        };

        const handleClick = (e, i) => {
            focusOn(i);
        };

        useLayoutEffect(() => {
            const dom = domRef.current;
            if (dom) {
                focusOn();
                // 监听黏贴事件
                dom.addEventListener('paste', (event) => {
                    // 阻止默认粘贴行为
                    event.preventDefault();
                    // 获取粘贴板数据
                    const clipboardData = event.clipboardData;
                    const pastedText = clipboardData.getData('text');
                    if (pastedText && String(pastedText).length === length) {
                        // 校验复制字段
                        if (pastedText && validator) {
                            if (typeof validator === 'function') {
                                if (!validator(pastedText)) {
                                    return;
                                }
                            } else if (!validator.test(pastedText)) {
                                return;
                            }
                        }
                        setCodeArr(String(pastedText).split(''));
                        onChange && onChange(String(pastedText));
                        onFinish &&
                            onFinish(
                                field
                                    ? { [field]: String(pastedText) }
                                    : String(pastedText),
                            );
                        // 自动聚焦
                        focusOn(length - 1);
                    } else {
                        return;
                    }
                });
            }
            return () => {
                if (dom) {
                    dom.removeEventListener('paste', () => {});
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
            <div ref={domRef} className={classNames(className, 'w-full')}>
                <div className="w-full text-center flex justify-between">
                    {Array(length)
                        .fill('')
                        .map((_, i) => (
                            <div
                                key={i}
                                className={classNames(
                                    'w-40px h-50px',
                                    boxClassName,
                                )}
                            >
                                <input
                                    className={classNames(
                                        'w-full h-full outline-none placeholder-baseColor bg-transparent flex-1 text-center leading-none',
                                        codeArr[i] &&
                                            'border border-[#E8BD70] border-solid',
                                        errorText &&
                                            'border border-[#FF5A5A] border-solid',
                                        inputClassName,
                                    )}
                                    maxLength={1}
                                    autoComplete={autoComplete}
                                    placeholder={
                                        currentFocus === i ? '' : placeholder
                                    }
                                    type="number"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    value={codeArr[i]}
                                    ref={(r) => (inputRef.current[i] = r)}
                                    onClick={(e) => handleClick(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onInput={(e) => handleInput(e, i)}
                                    onChange={(e) => handleChange(e, i)}
                                />
                            </div>
                        ))}
                </div>

                {errorText && (
                    <div className="w-full mt-6px text-[#FF5A5A] text-[12px] text-right">
                        {errorText}
                    </div>
                )}
            </div>
        );
    },
);

export default CodeInput;
