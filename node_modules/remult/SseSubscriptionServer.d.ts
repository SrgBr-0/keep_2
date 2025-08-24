import type { GenericResponse } from './server/index.js';
import type { Remult } from './src/context.js';
import type { SubscriptionServer } from './src/live-query/SubscriptionServer.js';
export declare class SseSubscriptionServer implements SubscriptionServer {
    private canUserConnectToChannel?;
    constructor(canUserConnectToChannel?: ((channel: string, remult: Remult) => boolean) | undefined);
    publishMessage<T>(channel: string, message: any): Promise<void>;
}
export interface ResponseRequiredForSSE {
    write(data: string): void;
    writeHead(status: number, headers: any): void;
    flush?(): void;
}
export declare class clientConnection {
    response: GenericResponse & ResponseRequiredForSSE;
    channels: Record<string, boolean>;
    timeOutRef?: NodeJS.Timeout;
    close(): void;
    closed: boolean;
    write(eventData: string, eventType?: string): void;
    connectionId: string;
    constructor(response: GenericResponse & ResponseRequiredForSSE);
    sendLiveMessage(): void;
}
