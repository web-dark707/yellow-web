import React, { FC, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { ResetIcon } from '@radix-ui/react-icons';
import { selectorIframe } from '@/store/common/selectors';
import { useSetIframe } from '@/store/common/hooks';
import { useMemoizedFn } from '@/hooks';

type IframeProps = {
    width?: string;
    height?: string;
    className?: string;
    frameBorder?: number;
    allowFullScreen?: boolean;
    allow?: string;
    loading?: 'eager' | 'lazy';
    scrolling?: string;
    title?: string;
};

export const Iframe: FC<IframeProps> = ({
    className,
    width = '100%',
    height = '100%',
    frameBorder = 0,
    allowFullScreen = true,
    allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    scrolling = 'no',
    title = '',
}) => {
    const iframeInfo = useRecoilValue(selectorIframe);
    const navigate = useNavigate();
    const setIframe = useSetIframe();
    const [time, setTime] = useState(new Date().getTime());
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef<HTMLDivElement>(null);

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
        setTime(new Date().getTime());
    };

    const handleClick = useMemoizedFn(() => {
        setIframe({
            url: '',
            isShowIframe: false,
        });
        navigate('/');
    });

    const onEnd = () => {
        setTime(new Date().getTime() - time);
    };

    useEffect(() => {
        if (time < 200) {
            handleClick();
        }
    }, [handleClick, time]);

    return (
        <>
            {iframeInfo.isShowIframe && (
                <div>
                    <iframe
                        src={iframeInfo.url}
                        width={width}
                        height={height}
                        frameBorder={frameBorder}
                        allowFullScreen={allowFullScreen}
                        allow={allow}
                        scrolling={scrolling}
                        title={title}
                        className={classNames(
                            className,
                            'fixed top-0 bottom-0 left-0 right-0 z-9999 bg-baseColor',
                        )}
                    ></iframe>
                    <Draggable
                        bounds={bounds}
                        onStart={(event, uiData) => onStart(event, uiData)}
                        handle={'#backButton'}
                        onStop={onEnd}
                    >
                        <div
                            ref={draggleRef}
                            className="fixed z-10000 bottom-20px right-20px "
                        >
                            <div
                                className="back-btn-gradient px-[9px] h-[38px] text-baseColor flex-row-center rounded-[12px] border border-solid border-[#D8C6AB] text-[#000]"
                                id="backButton"
                            >
                                <ResetIcon className="w-[20px] h-[20px] text-[#000]" />
                                <span>返回</span>
                            </div>
                        </div>
                    </Draggable>
                </div>
            )}
        </>
    );
};

export default Iframe;
