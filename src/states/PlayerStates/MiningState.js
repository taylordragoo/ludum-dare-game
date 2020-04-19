import State from '../State.js';

export default class MiningState extends State {
    enter(scene, player){
        console.log('Enter Mining');
    }
    execute(scene, player) {
        if(player.moveTo.isRunning){
            console.log('Stop Mining');
            scene.stateMachine.transition('move');
            return;
        }
    }
}