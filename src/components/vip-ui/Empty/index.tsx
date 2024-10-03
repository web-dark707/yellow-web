import React, { forwardRef, useRef, useImperativeHandle, Ref } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { EmptyProps, EmptyRef } from '@/types/vip-ui/empty';

const Empty = forwardRef((props: EmptyProps, ref: Ref<EmptyRef>) => {
    const { t } = useTranslation();
    const { icon, description, className, style } = props;
    const domRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
        dom: domRef.current,
    }));

    return (
        <div
            className={classNames(
                className,
                'flex-row-center flex-col py-30px',
            )}
            style={style}
            ref={domRef}
        >
            {icon || (
                <img
                    className="w-228px"
                    src={require(`@/assets/images/common/empty.webp`)}
                />
            )}
            <span className="text-center mt-20px text-[#fff] opacity-40 text-16px">
                {description || t('app.ui.noData')}
            </span>
        </div>
    );
});

export default Empty;
