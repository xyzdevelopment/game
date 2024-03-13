export {}

declare global {
    interface PixiInspectorHook {
        register(module: any): void
    }

    interface Window {
        __PIXI_INSPECTOR_GLOBAL_HOOK__: PixiInspectorHook
        __PIXI_APP__: any
    }
}
