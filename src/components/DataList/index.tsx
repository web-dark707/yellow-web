import React, { FC, PropsWithChildren, ReactNode } from 'react';
import classNames from 'classnames';
import { Empty, Loading } from '@/components/vip-ui';

type DatalistProps = {
    isLoading: boolean;
    isError?: boolean;
    noData: boolean;
    className?: string;
    emptyIcon?: ReactNode;
};

export const Datalist: FC<PropsWithChildren<DatalistProps>> = ({
    isError,
    isLoading,
    noData,
    children,
    className,
    emptyIcon,
}) => {
    return (
        <div className={classNames('w-full', className)}>
            {isLoading ? (
                <div className="flex-row-center">
                    <Loading />
                </div>
            ) : noData || isError ? (
                <div className="flex-row-center opacity-25">
                    <Empty icon={emptyIcon} />
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default Datalist;
