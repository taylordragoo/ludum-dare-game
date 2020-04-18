import State from '../State';

export default class MoveState extends State {
    enter(){
        console.log('Enter Move');
    }
    execute(scene, player) {
        console.log("Moving");

        if(!player.moveTo.isRunning){
            console.log('Stop Move');
            scene.stateMachine.transition('idle');
            return;
          }
    }
}