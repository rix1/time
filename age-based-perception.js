'use strict';

var Console = require('console').Console;
var fs = require('fs');
var readline = require('readline');

var output = fs.createWriteStream('./stdout.log');
var errorOutput = fs.createWriteStream('./stderr.log');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt(">> ");
rl.prompt();

// var person = {name:'',age:''};
var time = 60*60*24*365; // Seconds in a year

class Person {
	constructor(name, age) {
		this.name = name;
		this.age = age;
	}

	static setRelativeAge(p1, p2){
		p1.relAge =  Math.round((p1.age*time)/(p2.age*time) * 100) / 100;
		p2.relAge =  Math.round((p2.age*time)/(p1.age*time) * 100) / 100;
	}
}

var ppl = [];

var counter = 0;
var calc = false;

console.log("Hva heter du, og hvor gammel er du?")
rl.prompt();
rl.on('line', function (cmd) {

	if(calc){
		calculate(cmd.match(/\d+\.?\d*/), cmd.match(/[a-z]+/));
		rl.pause();
	}else if(cmd == "go!"){
		console.log("Hvor lang tid skal dere tilbringe sammen? (spesifiser min eller hrs)");
		rl.prompt();
		calc = true;

	}else{
		counter++;
		var num = cmd.match(/[0-9]+/g);
		var name = cmd.match(/[a-z]+/gi);

		if(num == null || name == null){
			console.log("COMPUTER SAYS: wops - please write name AND age:");
		}else{
			ppl.push(new Person(name[0], num[0]));
		}
		console.log("Og hva er navn og alder på vennnen din?");
		rl.prompt();
	}
});

function calculate(time, format){

	var timeFormat = '';

	if(format[0].charAt(0) == 'h' || format[0].charAt(0) == 't'){
		timeFormat = 'time'
	}else if(format[0].charAt(0) == 'm'){
		timeFormat = 'minutt';
	}else{
		console.log('Feil tidsformat! prøv å nytt');
		rl.prompt();
	}

	// console.log("Crunshing numbers...");
	// Person.setRelativeAge(ppl[0],ppl[1]);

	ppl.forEach(function(p1, index){
		
		if(index > 0){
			var p2 = ppl[0];
		}else p2 = ppl[1];
		
		Person.setRelativeAge(p1, p2);

		var fast = (p1.relAge < 1) ? 'raskere':'saktere';

		var tid = Math.round(time*p2.relAge*100)/100;
		var timeFormat2 = timeFormat;

		if(timeFormat == 'time' && tid < 1){
			tid = tid*60;
			timeFormat2 = 'minutter';
		}

		// var tid  = (timeFormat == 'm' && temp > 60) ? temp/60:temp;


		console.log("Tiden for %s(%d) oppleves som %d ganger %s enn for %s(%d).", p2.name, p2.age, p1.relAge, fast, p1.name, p1.age);
		console.log("Relativt sett føler derfor %s at %d %s(r) tar %d %s i forhold til %ss tidsoppfatning", p1.name, time, timeFormat, tid, timeFormat2, p2.name);
		console.log('');
		// EXAMPLE OUTPUT:		
		// "Tiden for Alice oppleves som 3.4 ganger saktere enn for Bob."
		// "Relativt sett føler derfor Alice at 1.3 timer tar 4,42 timer i forhold til Bobs tidsoppfatning"
	});
};
