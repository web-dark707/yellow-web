import {
    StringCodec,
    connect as nats_connect,
    Subscription,
    NatsConnection,
} from 'nats.ws';
const { encode, decode } = StringCodec();
import mitt, { Emitter } from 'mitt';
import { isDevMode } from '@/config/env';

interface _NatsWrapper {
    ws: NatsConnection | null;
    subscriptions: Subscription[];
    isConnected: boolean;
    emitter: Emitter<Record<string, string>>;

    connect: () => Promise<NatsConnection>;
    subscribe: (subject: string, callback: Function) => void;
    unsubscribe: (subject: string) => void;
    publish: (subject: string, message: any) => void;
    close: () => void;
}
class NatsWrapper implements _NatsWrapper {
    private static instance: NatsWrapper;
    public ws = null;
    public subscriptions = [];
    public isConnected = false;
    public emitter;
    private constructor() {
        this.emitter = mitt();
    }

    // 单例模式
    public static getInstance(): NatsWrapper {
        if (!NatsWrapper.instance) {
            NatsWrapper.instance = new NatsWrapper();
        }
        return NatsWrapper.instance;
    }

    async connect() {
        try {
            let protocol = 'ws:';
            if (window.location.protocol === 'https:') {
                protocol = 'wss:';
            }
            const suffix = isDevMode() ? '/nats' : '/ws';
            const nc = await nats_connect({
                servers: `${protocol}//${window.location.host}${suffix}`,
                reconnect: true,
            });

            this.isConnected = true;
            this.ws = nc;

            console.log(`connected to ${nc.getServer()}`);
            this.emitter.emit('success', 'success');
            return nc;
        } catch (err) {
            console.error(`error connecting to ${JSON.stringify(err)}`);
            this.isConnected = false;
            this.emitter.emit('error', 'error');
        }
    }

    subscribe(subject: string, callback: Function) {
        if (this.ws) {
            const sub = this.ws.subscribe(subject);

            (async () => {
                for await (const m of sub) {
                    callback(JSON.parse(decode(m.data)));
                }
            })();
            this.subscriptions.push(sub);
        }
    }

    unsubscribe(subject: string) {
        const sub = this.subscriptions.find((s) => s.getSubject() === subject);
        sub?.unsubscribe();
        this.subscriptions = this.subscriptions.filter(
            (s) => s.getSubject() !== subject,
        );
    }

    publish(subject: string, message: any) {
        if (this.ws) {
            this.ws.publish(subject, encode(message));
        }
    }

    close() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export default NatsWrapper;
