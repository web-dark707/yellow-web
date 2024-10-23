import React, {
    useRef,
    forwardRef,
    Ref,
    useImperativeHandle,
    useEffect,
    useCallback,
    useState,
    PropsWithChildren,
} from 'react';
import { throttle as lodashThrottle } from 'lodash';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ListStatus, ListProps, ListRef } from '@/types/vip-ui/list';
import { useMemoizedFn, useUpdateEffect } from '@/hooks';
import { Empty, Loading } from '@/components/vip-ui';
import { pxToVw } from '@/config/pxtovw';
import { randomString } from '@/utils/tools';
import PageIndicator from '../PageIndicator';

const List = forwardRef(
    (props: PropsWithChildren<ListProps>, ref: Ref<ListRef>) => {
        const {
            className = '',
            style,
            threshold = 40,
            throttle = 200,
            getData,
            isLoading,
            isError,
            hasMore,
            loadingArea,
            noMoreArea,
            errorArea,
            onClick,
            onEndReached,
            showEmpty = true,
            children,
            isReset = false,
            emptyIcon,
            firstLoad = true,
            pageIndicator = false,
        } = props;
        const domRef = useRef<HTMLDivElement | null>(null);
        const [nowStatus, setNowStatus] = useState<ListStatus>('default');
        const getDataRun = useMemoizedFn(getData);
        const { t } = useTranslation();
        const observer = useRef(null);
        const domId = useRef(randomString(10));

        useImperativeHandle(ref, () => ({
            dom: domRef.current,
        }));

        const handleContainerScroll = useCallback(() => {
            // 滚动到底部执行
            onEndReached && onEndReached();
            //上一次的请求没有成功，不再请求
            if (hasMore && !isLoading && !isError) {
                getDataRun();
            }
        }, [getDataRun, hasMore, isError, isLoading, onEndReached]);

        const handleChange = (page?: number) => {
            getDataRun(page);
        };

        const scrollFunc = throttle
            ? lodashThrottle(handleContainerScroll, throttle)
            : handleContainerScroll;

        useEffect(() => {
            if (!pageIndicator) {
                const scrollDomRef = document.getElementById(domId.current);
                observer.current = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        scrollFunc();
                    }
                });

                if (observer.current && scrollDomRef) {
                    observer.current.observe(scrollDomRef);
                }

                return () => {
                    if (observer.current) {
                        observer.current.disconnect();
                    }
                };
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [scrollFunc]);

        // 初始化请求
        useEffect(() => {
            firstLoad && getDataRun();
        }, [firstLoad, getDataRun]);

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
                default:
                    return (
                        <div
                            className="w-full"
                            id={domId.current}
                            style={{
                                height: pxToVw(threshold),
                            }}
                        ></div>
                    );
            }
        };

        return (
            <div
                className={classNames(className, 'w-full h-auto')}
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
                {pageIndicator && <PageIndicator onChange={handleChange} />}
            </div>
        );
    },
);

export default List;
