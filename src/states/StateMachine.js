export default class StateMachine {
    constructor(initialState, possibleStates, stateArgs=[]) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;

        for(const state of Object.values(this.possibleStates)) {
            state.stateMachinne = this;
        }
    }

    step(){
        if(this.state == null){
            console.log(this.state)
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs){
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }

    GetState(){
        return this.state;
    }
}