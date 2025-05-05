export class EventEmitter {
    private events: Record<string, Function[]> = {};

    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event: string, listener: Function): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    emit(event: string, ...args: any[]): void {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }

    // Remove all listeners for cleanup
    removeAllListeners(): void {
        this.events = {};
    }
}