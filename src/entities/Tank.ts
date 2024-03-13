import * as PIXI from 'pixi.js'
import { Bullet } from './Bullet'
import Facade from '@/Facade'
import { BLOCK_SIZE, MAP_WIDTH, MAP_HEIGHT } from './constants'
import { GridCell } from './Map'
export class Tank extends PIXI.Sprite {
    health: number
    direction: number // Angle in radians
    color: string
    bullets: Bullet[]

    constructor(color: string) {
        super(PIXI.Texture.WHITE)
        this.anchor.set(0.5)
        this.color = color
        this.health = 100
        this.bullets = []
        this.direction = 0
        this.tint = PIXI.utils.string2hex(color)
        Facade.app.stage.addChild(this)
        this.visible = color === 'red'
    }

    fire(tank: { direction: number; x: number; y: number }) {
        let bulletCount = 1
        let bulletDamage = 0
        let bulletOffset = 0
        switch (this.color) {
            case 'red':
                bulletCount = 2
                bulletDamage = 10
                bulletOffset = 50
                break
            case 'blue':
                bulletCount = 3
                bulletDamage = 20
                bulletOffset = 100
                break
            case 'green':
                bulletCount = 1
                bulletDamage = 25
                bulletOffset = 0
                break
        }
        const bulletSpreadAngle = Math.PI / 6 // Adjust this angle to control the spread of bullets
        for (let i = 0; i < bulletCount; i++) {
            const offsetX = Math.cos(tank.direction + bulletSpreadAngle * (i - bulletCount / 2)) // Spread the bullets evenly around the tank's direction
            const offsetY = Math.sin(tank.direction + bulletSpreadAngle * (i - bulletCount / 2)) // Spread the bullets evenly around the tank's direction
            const bullet = new Bullet(tank.x, tank.y, tank.direction, bulletDamage, 'red', offsetX * bulletOffset, offsetY * bulletOffset) // Adj
            this.bullets.push(bullet)
        }
    }

    rotate(rotation: number) {
        this.direction += rotation
        this.rotation = this.direction
    }

    move(x: number, y: number, map: GridCell[][], tank: any, slide: any) {
        const newX = this.x + x
        const newY = this.y + y

        // Check collision with walls and hays
        const gridX = Math.floor(newX / BLOCK_SIZE)
        const gridY = Math.floor(newY / BLOCK_SIZE)

        if (newX >= 0 && newX < MAP_WIDTH * BLOCK_SIZE && newY >= 0 && newY < MAP_HEIGHT * BLOCK_SIZE && !map[gridY][gridX].isWall && !map[gridY][gridX].isHay) {
            this.x = newX
            this.y = newY
        }
    }
}
