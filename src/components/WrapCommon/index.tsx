import React, { PropsWithChildren, ReactElement, Fragment } from 'react';

type WarpCommonProps = {};

export const WarpCommon = ({
    children,
}: PropsWithChildren<WarpCommonProps>) => {
    return <Fragment>{children as ReactElement}</Fragment>;
};

export default WarpCommon;
