var app = angular.module("turingApp", []);

app.controller("turingController", ["$scope", function($scope) {

	//automatic scrolling
	

	$scope.scroll = function() { 
		$("body, html").animate({scrollLeft: $(".reader").offset().left - $(window).width() * (.3)}, 1000)

	}

	$("body, html").on("load", $scope.scroll());



	//reset tape with reste button

	$scope.reset_tape = function() {
		
		$scope.reader.location = 510

		$scope.reader.state = "q1"

		for (var i=0; i<1000; i++) {
			$scope.cell[i].content = "B"
		}

		$scope.output_total = ""

		$scope.input_v_submit()


		//////make it so that it changes to the input, just make sure the input can be changed with the input button.

		$(".reader").animate({"left": "25514px"}, 1000)

	}
















	


	

	//tape and cells

	$scope.cell = []; //make an array that holds all the cells, each cell has an index and a content

	for(var i=0; i<1000; i++) {

		$scope.cell[i] = {

			index: i,

			content: "B",

		};

	};

	

	//reader

	$scope.reader = {

		location: 510,

		state: "q1",

		scanning: "B", //set to "B" by default in case you want to input 0, changed to 1 when an input is entered in.

	};








	//enters the input into the tape



	$scope.input_v_submit = function() {

		var input = parseInt($(".input_value").val());

		if (isNaN(input) == false) {

			$scope.submitted_input = input

		}

		for (cell_number = 510; cell_number < (510+input); cell_number++) {

			$scope.cell[cell_number].content = 1;
			
		}

		$scope.reader.scanning = 1 //resents the value of scanning in the reader after it is changed to 1

	}


	//shows output

	$scope.output = function() {

		$scope.output_total = 0;

		for (k = 0; k < $scope.cell.length; k++) {

			if ($scope.cell[k].content === 1) {

				$scope.output_total++;

			}

		}

	}





	//enter in program line objects into the program array when button is clicked


	$scope.program = [];


	$scope.add_line = function() {

		//temportary error messages

		$scope.error_message = ""

		if ($(".line1").val() == "" || $(".line2").val() == "" || $(".line3").val() == "" || $(".line4").val() == "" || $(".line5").val() == "") {

			$scope.error_message = "A field is blank!"

			return;
			
		}	

		if ($(".line2").val() != "0" && $(".line2").val() != "1" && $(".line2").val().toUpperCase() != "B") {

			$scope.error_message = "A cell can only contain a 1, 0, or B!"

			return;

		}

		if ($(".line3").val() != "0" && $(".line3").val() != "1" && $(".line3").val().toUpperCase() != "B") {

			$scope.error_message = "A cell can only contain a 1, 0, or B!"

			return;
			
		}

		if ($(".line4").val().toUpperCase() != "R" && $(".line4").val().toUpperCase() != "L" && $(".line4").val().toUpperCase() != "N") {

			$scope.error_message = "The reader can only move R, L, or N!"

			return;
			
		}

		

		//first, deal with the scaninning and print

		if ($(".line2").val().toUpperCase() === "B") {
			var current_scanning_variable = "B";
		}
		else {
			current_scanning_variable = parseInt($(".line2").val());
		}

		if ($(".line3").val().toUpperCase() === "B") {
			var print_variable = "B";
		}
		else {
			print_variable = parseInt($(".line3").val());
		}

		//add the code line to the program array

		$scope.program.push({

			current_state: $(".line1").val().toLowerCase(),
			current_scanning: current_scanning_variable,
			print: print_variable,
			move: $(".line4").val().toUpperCase(),
			next_state: $(".line5").val().toLowerCase()

		})

	}





	//delete line from line list

	$scope.show_delete_button = function(e) {

		angular.element(e.target).children(".delete_line_button").show()

	}

	$scope.hide_delete_button = function(e) {

		angular.element(e.currentTarget).children(".delete_line_button").hide()

	}


	$scope.delete_line = function(x) {

		delete $scope.program[x];

		for (var i=x; i < $scope.program.length - 1; i++) {

			$scope.program[i] = $scope.program[i+1]

		}

		$scope.program.pop()

	}














	//set reader speed

	reader_speed = 2000;


	$scope.change_speed_slow = function() {

		reader_speed = 2000;

	}

	$scope.change_speed_fast = function() {

		reader_speed = 500;

	}



	








	//RUN THE TURING MACHINE






	$scope.run_program = function(j) {

		$("html").css("overflow","hidden")

		//declare variables for program line components, for ease of reading

		var current_state = [];
		var current_scanning = [];
		var print = [];
		var move = [];
		var next_state = [];

		for (var t = 0; t < $scope.program.length; t++) {

		current_state[t] = $scope.program[t].current_state;
		current_scanning[t] = $scope.program[t].current_scanning;
		print[t] = $scope.program[t].print;
		move[t] = $scope.program[t].move;
		next_state[t] = $scope.program[t].next_state;

		}









		//declare variable for the movement function




		var update_state_and_scanning_then_rerun_and_apply = function() {

			$scope.reader.state = next_state[j]; 

			$scope.reader.scanning = $scope.cell[$scope.reader.location].content

			$scope.run_program(0);

			$scope.$apply();

		}




		var move_reader = function(index, speed) {

			switch(move[index]) {

				case "R": 

					$scope.reader.location += 1;

					if ($(".reader").offset().left - $(window).scrollLeft() > $(window).width() * (.8)) {
						$scope.scroll()
					}

					$(".reader").animate({"left":"+=50px"}, speed, function() {

					update_state_and_scanning_then_rerun_and_apply()

					});

					break;

				case "L":

					$scope.reader.location -= 1;

					if ($(".reader").offset().left - $(window).scrollLeft() < $(window).width() * (.2)) {
						$("body, html").animate({scrollLeft: $(".reader").offset().left - $(window).width() * (.7)}, 1000)
					}

					

					$(".reader").animate({"left":"-=50px"}, speed, function() {

					update_state_and_scanning_then_rerun_and_apply()

					});

					break;

				case "N":

					$scope.reader.location += 0;

					$(".reader").animate({"left":"+=0px"}, speed, function() {

					update_state_and_scanning_then_rerun_and_apply()

					});

					break;

			}

		}



		//actual turing program, runs through the turing lines

//		if (j === 0) {
//
//			$(".line_scanner").animate({"top":"0px"}, 200)
//
//			$(".line_scanner").css("background-color","coral")
//
//		}

		if (j<$scope.program.length) {

			if ($scope.reader.state === current_state[j] && $scope.reader.scanning === current_scanning[j]) { //if there is a match in the program

//				$(".line_scanner").css("background-color","red")
//
//				$(".line_scanner").animate({"width":"+=30px", "left":"-=15px"}, 200)
//
//				$(".line_scanner").animate({"width":"-=30px", "left":"+=15px"}, 200)

				$scope.cell[$scope.reader.location].content = print[j]; //change the cell to have new content

				move_reader(j, reader_speed)

			}

			else {

//				$(".line_scanner").animate({"top":"+=25px"}, 500, function() {
//
					j++;

					$scope.run_program(j);
//
//				})

			}

		}

		else {

			$scope.output();

			$("html").css("overflow","auto")

			return;

		}
		
	}










/////test space




































}]); //close controller

