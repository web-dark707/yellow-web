import React from 'react';
import { createRoot } from 'react-dom/client';

export interface ImageViewerBaseProps {
    className?: string;
    clickExternal?: boolean;
    image: string;
}

let activeImageView: any = null; // 用来追踪当前的ImageView

export function show(Component) {
    return (props: ImageViewerBaseProps) => {
        if (activeImageView) {
            activeImageView(); // 如果已经有ImageView，先关闭它
        }

        const div = document.createElement('div');
        document.body.appendChild(div);
        const root = createRoot(div);

        function destroy() {
            root.unmount();
            document.body.removeChild(div);
            if (activeImageView === close) {
                // 如果当前关闭的ImageView是活跃的ImageView，将全局变量设为null
                activeImageView = null;
            }
        }

        const dynamicProps = {
            ...props,
            onCancel: destroy,
            visible: true,
        };

        root.render(<Component {...dynamicProps}></Component>);

        function close() {
            dynamicProps.visible = false;
            root.render(<Component {...dynamicProps}></Component>);
            if (activeImageView === close) {
                // 如果当前关闭的ImageView是活跃的ImageView，将全局变量设为null
                activeImageView = null;
            }
        }

        activeImageView = close; // 设置当前ImageView为活跃的ImageView
    };
}
