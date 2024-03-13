import * as PIXI from 'pixi.js'
import Facade from '@/Facade'
import { BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants'
import { GridCell } from './Map'
export class Bullet extends PIXI.Sprite {
    speed: number = 5
    damage: number
    color: string

    constructor(x: number, y: number, direction: number, damage: number, color: string, offsetX: number = 0, offsetY: number = 0) {
        super(PIXI.Texture.WHITE)
        this.anchor.set(0.5)
        this.x = x + offsetX
        this.y = y + offsetY
        this.rotation = direction
        this.damage = damage
        this.color = color
        this.name = 'bullet'
        this.tint = PIXI.utils.string2hex(color)
        Facade.app.stage.addChild(this)
    }

    update(grid: GridCell[][]) {
        if (!this.parent) return // Exit if bullet has been removed from the display list

        const velocityX = Math.cos(this.rotation) * this.speed
        const velocityY = Math.sin(this.rotation) * this.speed
        this.x += velocityX
        this.y += velocityY

        // Check collision with walls and hays using the provided grid
        const gridX = Math.floor(this.x / BLOCK_SIZE)
        const gridY = Math.floor(this.y / BLOCK_SIZE)
        if (grid[gridY] && grid[gridY][gridX]) {
            if (grid[gridY][gridX].isHay) {
                // Hay hit by the bullet

                grid[gridY][gridX].health -= this.damage // Decrease hay's health
                if (grid[gridY][gridX].health <= 0) {
                    // Remove hay if its health is <= 0
                    grid[gridY][gridX].isHay = false // Remove hay from the grid
                    const hayGraphics = this.parent.getChildByName(`hay_${gridX}_${gridY}`) // Find the hay graphics
                    if (hayGraphics) {
                        this.parent.removeChild(hayGraphics) // Remove hay from the display list
                    }
                }
                if (this.parent) {
                    this.parent.removeChild(this) // Remove bullet from the display list
                }
                return
            } else if (grid[gridY][gridX].isWall) {
                // Remove bullet if it hits a wall
                if (this.parent) {
                    this.parent.removeChild(this)
                }
                return
            }
        }

        // Remove bullet if out of bounds
        if (this.x < 0 || this.x > MAP_WIDTH * BLOCK_SIZE || this.y < 0 || this.y > MAP_HEIGHT * BLOCK_SIZE) {
            if (this.parent) {
                this.parent.removeChild(this)
            }
            return
        }
    }
}
