import React, { PropsWithChildren, ReactElement, Fragment } from 'react';
import Iframe from '../Iframe';

type WarpCommonProps = {};

export const WarpCommon = ({
    children,
}: PropsWithChildren<WarpCommonProps>) => {
    return (
        <Fragment>
            {children as ReactElement}
            {/* Iframe */}
            <Iframe></Iframe>
        </Fragment>
    );
};

export default WarpCommon;
