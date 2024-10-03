import React, { useRef, forwardRef, useImperativeHandle, Ref } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { LoadingProps, LoadingRef } from '@/types/vip-ui/loading';
import { pxToVw } from '@/config/pxtovw';
import './index.scoped.scss';

const Loading = forwardRef((props: LoadingProps, ref: Ref<LoadingRef>) => {
    const { t } = useTranslation();
    const domRef = useRef<HTMLDivElement | null>(null);

    const {
        stroke = 2,
        color,
        duration = 1500,
        style,
        className,
        size = 18,
        radius = 12,
        text = t('app.ui.loading'),
    } = props;

    const circlePos = 0.5 * stroke + radius;
    const circleSize = radius * 2 + stroke;
    const halfCircle = Math.PI * radius;

    useImperativeHandle(ref, () => ({
        dom: domRef.current,
    }));

    const renderArc = () => {
        return (
            <svg viewBox={`0 0 ${circleSize} ${circleSize}`}>
                <circle
                    className="vip-arc-bg"
                    cx={circlePos}
                    cy={circlePos}
                    r={radius}
                    strokeWidth={stroke}
                    fill="none"
                />
                <circle
                    className="vip-arc-line"
                    cx={circlePos}
                    cy={circlePos}
                    r={radius}
                    style={{ stroke: color }}
                    strokeWidth={stroke}
                    strokeDashoffset={halfCircle * 0.5}
                    strokeDasharray={`${halfCircle * 0.5} ${halfCircle * 1.5}`}
                    fill="none"
                    {...{ strokeLinecap: 'round' }}
                />
            </svg>
        );
    };

    const getLoadingStyle = (): React.CSSProperties => {
        return {
            display: 'inline-block',
            width: pxToVw(size),
            height: pxToVw(size),
            animationDuration: `${duration}ms`,
            ...(style || {}),
        };
    };

    return (
        <div className="flex-col-center">
            <div
                className={classNames(className, 'vip-arc')}
                style={getLoadingStyle()}
                ref={domRef}
            >
                {renderArc()}
            </div>
            {text && (
                <div className="mt-8px text-lgSize text-primaryColor">
                    {text}
                </div>
            )}
        </div>
    );
});

export default Loading;
