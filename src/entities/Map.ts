import Facade from '@/Facade'
import { DEFAULT_HAY_HEALTH, BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT, HAY_COUNT, WALL_COUNT } from './constants'
import * as PIXI from 'pixi.js'

export type GridCell = {
    isWall: boolean
    isHay: boolean
    health: number // Health property for hay objects
}

export class Map {
    grid: GridCell[][]

    constructor() {
        this.grid = []
        this.generateMap()
        this.renderMap()
    }

    generateMap() {
        // Generate the map grid
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const row: GridCell[] = []
            for (let x = 0; x < MAP_WIDTH; x++) {
                row.push({ isWall: false, isHay: false, health: DEFAULT_HAY_HEALTH })
            }
            this.grid.push(row)
        }

        // Place walls
        let wallsPlaced = 0
        while (wallsPlaced < WALL_COUNT) {
            const { x, y } = this.getRandomCoordinates()
            if (!this.grid[y][x].isWall && !this.grid[y][x].isHay) {
                this.grid[y][x].isWall = true
                wallsPlaced++
            }
        }

        // Place hays
        let haysPlaced = 0
        while (haysPlaced < HAY_COUNT) {
            const { x, y } = this.getRandomCoordinates()
            if (!this.grid[y][x].isWall && !this.grid[y][x].isHay) {
                this.grid[y][x].isHay = true
                haysPlaced++
            }
        }
    }

    renderMap() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cell = this.grid[y][x]
                const graphics = new PIXI.Graphics()
                if (cell.isWall) {
                    graphics.beginFill(0xffffff) // Wall color
                } else if (cell.isHay) {
                    graphics.beginFill(0xffff00) // Hay color
                    graphics.name = `hay_${x}_${y}`
                } else {
                    graphics.beginFill(0x000000) // Empty space color
                    graphics.name = `block_${x}_${y}`
                }
                graphics.width = 35
                graphics.height = 35
                graphics.drawRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
                graphics.endFill()
                Facade.app.stage.addChild(graphics)
            }
        }
    }

    getRandomCoordinates(): { x: number; y: number } {
        return {
            x: Math.floor(Math.random() * MAP_WIDTH),
            y: Math.floor(Math.random() * MAP_HEIGHT),
        }
    }
}
