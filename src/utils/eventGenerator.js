import Events from './events.json';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export default function GetEvent(scene) {
	let type;
	const variety = getRandomInt(6);
	
	if(variety === 1 || variety === 2) {
		type = "negative";
	} else if (variety === 3 || variety === 4) {
		type = "neutral";
	} else {
		type = "good";
	};

	const event = Events[type].findIndex([getRandomInt(Events[type].length -1)]);
	console.log("event")
	return event;
}