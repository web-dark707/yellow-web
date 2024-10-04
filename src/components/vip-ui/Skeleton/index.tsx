import React, { forwardRef, PropsWithChildren, Ref } from 'react';
import './index.scss';
import classNames from 'classnames';
import SkeletonProps, { SkeletonRef } from '@/types/vip-ui/skeleton';
const Skeleton = forwardRef(
    (props: PropsWithChildren<SkeletonProps>, ref: Ref<SkeletonRef>) => {
        const { loading = true, className, children } = props;
        return loading ? (
            <div
                className={classNames(
                    'rounded-md skeleton-bg w-full h-full overflow-hidden',
                    className,
                )}
            >
                <div className="skeleton-sunlight w-full h-full" />
            </div>
        ) : (
            children
        );
    },
);

export default Skeleton;
