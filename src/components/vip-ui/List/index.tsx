import React, {
    useRef,
    forwardRef,
    Ref,
    useImperativeHandle,
    useEffect,
    useState,
    PropsWithChildren,
} from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ListStatus, ListProps, ListRef } from '@/types/vip-ui/list';
import { useMemoizedFn, useUpdateEffect } from '@/hooks';
import { Empty, Loading } from '@/components/vip-ui';
import PageIndicator from '../PageIndicator';

const List = forwardRef(
    (props: PropsWithChildren<ListProps>, ref: Ref<ListRef>) => {
        const {
            className = '',
            style,
            getData,
            isLoading,
            isError,
            hasMore,
            loadingArea,
            noMoreArea,
            errorArea,
            onClick,
            showEmpty = true,
            children,
            isReset = false,
            emptyIcon,
            pageIndicator = false,
            total = 0,
        } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        const [nowStatus, setNowStatus] = useState<ListStatus>('default');
        const getDataRun = useMemoizedFn(getData);
        const { t } = useTranslation();

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        const handleChange = (page: number) => {
            getDataRun(page);
        };

        // 加载状态
        useEffect(() => {
            if (!hasMore) {
                setNowStatus('nomore');
            } else if (isLoading) {
                setNowStatus('loading');
            } else if (isError) {
                setNowStatus('error');
            } else {
                setNowStatus('default');
            }
        }, [hasMore, isLoading, isError]);

        const handleClick = (
            e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        ) => {
            onClick && onClick(e);
        };

        const handleErrorClick = () => {
            getDataRun();
        };

        useUpdateEffect(() => {
            if (isReset) {
                getDataRun();
            }
        }, [isReset]);

        const renderArea = () => {
            switch (nowStatus) {
                case 'loading':
                    return loadingArea === void 0 ? (
                        <div
                            className="w-full flex-row-center mt-8px"
                            id="loading"
                        >
                            <Loading />
                        </div>
                    ) : (
                        loadingArea
                    );
                case 'nomore':
                    return noMoreArea === void 0 ? (
                        <div className="w-full h-40px leading-40px text-center text-[#fff] opacity-40 text-lgSize">
                            {t('app.ui.noMore')}
                        </div>
                    ) : (
                        noMoreArea
                    );
                case 'error':
                    return errorArea === void 0 ? (
                        <div
                            className="w-full h-40px leading-40px text-center text-[#fff] opacity-40 text-lgSize"
                            onClick={handleErrorClick}
                        >
                            {t('app.ui.loadError')}
                        </div>
                    ) : (
                        errorArea
                    );
            }
        };

        return (
            <div
                className={classNames(className, 'w-full')}
                ref={domRef}
                onClick={handleClick}
                style={style}
            >
                {showEmpty && !isLoading ? (
                    <Empty className="opacity-25 mx-auto" icon={emptyIcon} />
                ) : (
                    <>
                        {children}
                        {renderArea()}
                    </>
                )}
                {pageIndicator && (
                    <PageIndicator
                        isReset={isReset}
                        onChange={handleChange}
                        total={total}
                    />
                )}
            </div>
        );
    },
);

export default List;
