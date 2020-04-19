import State from '../State.js';

export default class IdleState extends State {
    enter(scene, player){
        console.log('Enter Idle');
    }
    execute(scene, player) {
        // player.gas++;
        if(player.moveTo.isRunning){
            console.log('Stop Idle');
            scene.stateMachine.transition('move');
            return;
        }
    }
}