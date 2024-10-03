import React, { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { FooterButtonOptions } from '@/types/vip-ui/dialog';

export interface DialogBaseProps {
    title?: ReactNode;
    className?: string;
    content?: ReactNode;
    footer?: FooterButtonOptions;
    renderFooter?: (close?: () => void) => ReactNode;
    showCloseIcon?: boolean;
}

let activeDialog: any = null; // 用来追踪当前的dialog

export function open(Component) {
    return (props: DialogBaseProps) => {
        if (activeDialog) {
            activeDialog(); // 如果已经有dialog，先关闭它
        }

        const div = document.createElement('div');
        document.body.appendChild(div);
        const root = createRoot(div);

        function destroy() {
            root.unmount();
            document.body.removeChild(div);
            if (activeDialog === close) {
                // 如果当前关闭的dialog是活跃的dialog，将全局变量设为null
                activeDialog = null;
            }
        }

        const dynamicProps = {
            ...props,
            close: destroy,
            visible: true,
        };

        root.render(<Component {...dynamicProps}></Component>);

        function close() {
            dynamicProps.visible = false;
            root.render(<Component {...dynamicProps}></Component>);
            if (activeDialog === close) {
                // 如果当前关闭的dialog是活跃的dialog，将全局变量设为null
                activeDialog = null;
            }
        }

        activeDialog = close; // 设置当前dialog为活跃的dialog
    };
}
