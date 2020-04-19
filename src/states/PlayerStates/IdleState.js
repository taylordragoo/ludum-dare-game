import State from '../State.js';

export default class IdleState extends State {
    enter(scene, player){
    }
    execute(scene, player) {
        if(player.moveTo.isRunning){
            scene.stateMachine.transition('move');
            return;
        }
    }
}