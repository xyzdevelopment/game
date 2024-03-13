import * as PIXI from 'pixi.js'
import { AppViewport } from '@/application/AppViewport'
import Facade from '@/Facade'
import { Tank } from '../entities/Tank'
import { Bullet } from '../entities/Bullet'
import { Map } from '../entities/Map' // Import the Map class
import { BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT, HAY_COUNT, WALL_COUNT } from '../entities/constants'

export class Application {
    activeTank: any
    map: Map // Declare a map property
    tanks: any[]
    public constructor() {
        new AppViewport()
        AppViewport.registerInspector()
        const appWidth = Facade.app.renderer.width
        const appHeight = Facade.app.renderer.height

        // Create map
        this.map = new Map()

        // Create tanks
        this.tanks = []
        // Create tanks
        const redTank = new Tank('red')
        redTank.x = (appWidth - redTank.width) / 2 // Horizontal center of the screen
        redTank.y = (appHeight - redTank.height) / 2 // Vertical center of the screen
        this.tanks.push(redTank)
        this.activeTank = redTank
        Facade.app.stage.addChild(redTank)

        const blueTank = new Tank('blue')
        blueTank.x = (appWidth - blueTank.width) / 2 // Horizontal center of the screen
        blueTank.y = (appHeight - blueTank.height) / 2 // Vertical center of the screen
        this.tanks.push(blueTank)
        Facade.app.stage.addChild(blueTank)

        const greenTank = new Tank('green')
        greenTank.x = (appWidth - greenTank.width) / 2 // Horizontal center of the screen
        greenTank.y = (appHeight - greenTank.height) / 2 // Vertical center of the screen
        this.tanks.push(greenTank)
        Facade.app.stage.addChild(greenTank)

        // Keyboard events
        const keys: { [key: string]: boolean } = {}
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true

            // Fire bullet
            if (e.key === ' ') {
                const activeTank = this.activeTank
                activeTank.fire(this.activeTank)
            }

            // Switch tank
            if (e.key === 't') {
                this.switchTankColor()
            }
        })

        window.addEventListener('keyup', (e) => {
            keys[e.key] = false
        })

        Facade.app.ticker.add(() => {
            const activeTank = this.activeTank

            // Tank movement
            if (keys['ArrowDown']) {
                activeTank.move(Math.cos(activeTank.rotation) * 2, Math.sin(activeTank.rotation) * 2, this.map.grid, activeTank, 'ArrowUp')
            }
            if (keys['ArrowUp']) {
                activeTank.move(-Math.cos(activeTank.rotation) * 2, -Math.sin(activeTank.rotation) * 2, this.map.grid, activeTank, 'ArrowDown')
            }
            if (keys['ArrowLeft']) {
                activeTank.rotate(-0.05)
            }
            if (keys['ArrowRight']) {
                activeTank.rotate(0.05)
            }

            // Bullet movement and collision

            activeTank.bullets.forEach((bullet: any) => {
                bullet.update(this.map.grid)
            })
        })
    }
    switchTankColor() {
        // Find the index of the current active tank
        const currentIndex = this.tanks.indexOf(this.activeTank)
        // Hide the current active tank
        this.activeTank.visible = false
        // Switch to the next tank in the array
        const nextIndex = (currentIndex + 1) % this.tanks.length
        this.activeTank = this.tanks[nextIndex]
        this.activeTank.x = this.tanks[currentIndex].x
        this.activeTank.y = this.tanks[currentIndex].y

        // Show the new active tank
        this.activeTank.visible = true
    }
}
