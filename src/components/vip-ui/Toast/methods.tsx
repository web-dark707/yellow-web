import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';

export interface ToastBaseProps {
    onClose?: () => void;
    duration?: number;
    content?: React.ReactNode;
    type?: string;
}

let activeToast: any = null; // 用来追踪当前的toast

export function toast<P extends ToastBaseProps>(
    Component: FC<P>,
    type?: string,
) {
    return (originConfig: string | P) => {
        if (activeToast) {
            activeToast(); // 如果已经有toast，先关闭它
        }

        const config =
            typeof originConfig === 'string'
                ? ({
                      content: originConfig,
                      type: 'info',
                  } as P)
                : originConfig;

        if (type !== void 0) {
            config.type = type;
        }

        const div = document.createElement('div');
        document.body.appendChild(div);
        const root = createRoot(div);

        function destroy() {
            const { onClose } = config;
            onClose && onClose();
            root.unmount();
            document.body.removeChild(div);
            if (activeToast === close) {
                // 如果当前关闭的toast是活跃的toast，将全局变量设为null
                activeToast = null;
            }
        }

        const dynamicProps = {
            ...config,
            onClose: destroy,
            close,
            visible: true,
        };

        root.render(<Component {...dynamicProps}></Component>);

        function close() {
            dynamicProps.visible = false;
            root.render(<Component {...dynamicProps}></Component>);
            if (activeToast === close) {
                // 如果当前关闭的toast是活跃的toast，将全局变量设为null
                activeToast = null;
            }
        }

        activeToast = close; // 设置当前toast为活跃的toast

        return destroy;
    };
}
