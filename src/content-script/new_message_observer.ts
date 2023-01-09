export class NewMessageObserver {
    private observer: MutationObserver;
    private target: Node;

    constructor(callback: (element: Node) => void, target: Node) {
        this.target = target;
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                callback(target);
            });
        });
        const observerOptions = {
            attributes: true,
            childList: true,
            characterData: true,
        };
        this.observer.observe(target, observerOptions);
    }

    getTarget(): Node {
        return this.target;
    }

    disconnect(): void {
        this.observer.disconnect();
    }
}