import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '../vip-ui';

type ErrorProps = {
    message: string;
    handleError: () => void;
};

const Error: FC<ErrorProps> = ({ message, handleError }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full flex-col-center">
            <div className="text-[#808080] mt-[16px]">{message}</div>
            <Button
                onClick={() => {
                    window.location.reload();
                    handleError();
                }}
                className="mt-[34px] w-[40%] h-36px"
            >
                {t('app.ui.reload')}
            </Button>
        </div>
    );
};

interface WithErrorScreenProps {}
export default function WithErrorScreen<Props extends WithErrorScreenProps>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: ComponentType<Props> = (props) => (
        <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
                <Error
                    message={error.message}
                    handleError={resetErrorBoundary}
                ></Error>
            )}
        >
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    Component.displayName = `WithErrorScreen(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
