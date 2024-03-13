import * as PIXI from 'pixi.js'
import Facade from '@/Facade'

export class AppViewport {
    readonly app: PIXI.Application
    size: number[]
    ratio: number

    public constructor() {
        const canvas = document.getElementById('gameCanvas')

        this.size = [800, 800]
        this.ratio = this.size[0] / this.size[1]

        this.app = new PIXI.Application({
            autoStart: true,
            resolution: 1,
            antialias: false,
            clearBeforeRender: true,
            powerPreference: 'high-performance',
            view: canvas as HTMLCanvasElement,
            resizeTo: window,
            backgroundColor: 0x282b2d,
        })
        this.app.stage.scale.set(0.6, 0.44)

        Facade.stage = this.app.stage
        Facade.stage.interactive = true
        Facade.app = this.app
    }
    public static registerInspector() {
        const inspector = window.__PIXI_INSPECTOR_GLOBAL_HOOK__
        window.__PIXI_APP__ = Facade.app

        if (inspector != null) {
            inspector.register({ PIXI: PIXI })
        }
    }
}
