import State from '../State.js';

export default class StartState extends State {
    enter(scene, player){
        console.log('Enter Start');
    }
    execute(scene, player) {
        if(player.moveTo.isRunning){
            console.log('Stop Start');
            scene.stateMachine.transition('move');
            return;
        }
    }
}