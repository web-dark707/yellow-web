import { Events, Plugin } from 'xgplayer';
import './index.scss';

const { POSITIONS } = Plugin;

export default class ForwardPlugin extends Plugin {
    private _player;
    // 插件的名称，将作为插件实例的唯一key值
    static get pluginName() {
        return 'ForwardPlugin';
    }

    static get defaultConfig() {
        return {
            // 挂载在controls的右侧，如果不指定则默认挂载在播放器根节点上
            position: POSITIONS.CONTROLS_LEFT,
        };
    }

    constructor(args) {
        super(args);
        this.hide();
    }

    beforePlayerInit() {
        this._player = this.player;
        this.on(Events.FULLSCREEN_CHANGE, (isFullscreen) => {
            if (isFullscreen) {
                this.show('flex');
            } else {
                this.hide();
            }
        });
        // TODO 播放器调用start初始化播放源之前的逻辑
    }

    afterPlayerInit() {
        // TODO 播放器调用start初始化播放源之后的逻辑
    }

    afterCreate() {
        const onRewindClick = () => {
            console.log(Math.max(this.player.currentTime - 15, 0));

            this.player.currentTime = Math.max(this.player.currentTime - 15, 0);
        };
        const onForwardClick = () => {
            console.log(
                Math.min(this.player.currentTime + 15, this.player.duration),
            );

            this.player.currentTime = Math.min(
                this.player.currentTime + 15,
                this.player.duration,
            );
        };
        // // 对当前插件根节点内部类名为.icon的元素绑定click事件
        this.bind('.forward', 'click', onForwardClick);
        this.bind('.rewind', 'click', onRewindClick);

        // // 对当前插件根节点绑定click事件
        // this.bind('click', this.onClick);
        // //TODO 插件实例化之后的一些逻辑
    }

    destroy() {
        // this.unbind('.icon', 'click', this.onIconClick);
        // this.unbind('click', this.onClick);
        // this.icon = null;
        // // 播放器销毁的时候一些逻辑
    }

    render() {
        return `<div class="plugin-box">
        <svg
            t="1729774865449"
            class="icon rewind"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2432"
            width="200"
            height="200"
        >
            <path
                d="M512 73.142857c242.377143 0 438.857143 196.48 438.857143 438.857143S754.377143 950.857143 512 950.857143 73.142857 754.377143 73.142857 512a36.571429 36.571429 0 1 1 73.142857 0c0 201.984 163.730286 365.714286 365.714286 365.714286s365.714286-163.730286 365.714286-365.714286S713.984 146.285714 512 146.285714a365.385143 365.385143 0 0 0-294.326857 148.553143l22.217143-3.492571a36.571429 36.571429 0 1 1 11.446857 72.228571l-108.361143 17.170286a36.571429 36.571429 0 0 1-41.837714-30.409143l-17.170286-108.361143a36.571429 36.571429 0 1 1 72.246857-11.428571l3.181714 20.096A438.491429 438.491429 0 0 1 512 73.142857z m203.574857 294.217143v45.220571h-145.718857l-8.576 93.202286h1.078857c13.494857-20.790857 39.003429-33.005714 70.070857-33.005714 58.934857 0 101.357714 42.861714 101.357715 101.796571 0 64.073143-47.579429 108.214857-116.150858 108.214857-62.08 0-107.648-36.516571-112.036571-89.234285l-0.237714-3.986286h51.858285c3.419429 28.928 28.288 48.438857 60.854858 48.438857 36.845714 0 62.354286-25.508571 62.354285-61.933714 0-36.205714-25.709714-61.714286-62.134857-61.714286-25.106286 0-45.037714 10.514286-57.106286 29.366857l-2.048 3.419429h-48.219428l14.793143-179.785143h189.860571z m-284.781714 0V676.571429h-54.217143V420.077714h-1.28l-79.945143 54.857143v-50.797714l80.786286-56.777143h54.656z"
                fill="#ffffff"
                p-id="2433"
            ></path>
        </svg>
        <svg
            t="1729774177633"
            class="icon forward"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1324"
            width="200"
            height="200"
        >
            <path
                d="M512 73.142857c138.88 0 266.24 65.097143 347.940571 171.337143l4.662858 6.162286 3.181714-20.114286a36.571429 36.571429 0 0 1 72.576 8.740571l-0.329143 2.706286-17.170286 108.361143a36.571429 36.571429 0 0 1-39.131428 30.738286l-2.706286-0.329143-108.361143-17.152a36.571429 36.571429 0 0 1 8.722286-72.576l2.706286 0.329143 22.235428 3.492571A365.421714 365.421714 0 0 0 512 146.285714C310.016 146.285714 146.285714 310.016 146.285714 512s163.730286 365.714286 365.714286 365.714286 365.714286-163.730286 365.714286-365.714286a36.571429 36.571429 0 0 1 73.142857 0c0 242.377143-196.48 438.857143-438.857143 438.857143S73.142857 754.377143 73.142857 512 269.622857 73.142857 512 73.142857z m203.574857 294.217143v45.220571h-145.718857l-8.576 93.202286h1.078857c13.494857-20.790857 39.003429-33.005714 70.070857-33.005714 58.934857 0 101.357714 42.861714 101.357715 101.796571 0 64.073143-47.579429 108.214857-116.150858 108.214857-62.08 0-107.648-36.516571-112.036571-89.234285l-0.237714-3.986286h51.858285c3.419429 28.928 28.288 48.438857 60.854858 48.438857 36.845714 0 62.354286-25.508571 62.354285-61.933714 0-36.205714-25.709714-61.714286-62.134857-61.714286-25.106286 0-45.037714 10.514286-57.106286 29.366857l-2.048 3.419429h-48.219428l14.793143-179.785143h189.860571z m-284.781714 0V676.571429h-54.217143V420.077714h-1.28l-79.945143 54.857143v-50.797714l80.786286-56.777143h54.656z"
                fill="#ffffff"
                p-id="1325"
            ></path>
        </svg>
    </div>`;
    }
}