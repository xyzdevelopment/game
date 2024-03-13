import { Application } from '@/application/Application'
import Facade from '@/Facade'

window.onload = function () {
    Facade.application = new Application()
}
