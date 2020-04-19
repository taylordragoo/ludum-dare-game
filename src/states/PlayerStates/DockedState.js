import State from '../State.js';

export default class DockedState extends State {
    enter(scene, player){
        console.log('Enter Docked');
    }
    execute(scene, player) {
        if(player.moveTo.isRunning){
            console.log('Stop Docked');
            scene.stateMachine.transition('move');
            return;
        }
    }
}