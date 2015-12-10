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

	$scope.temp_line_array = [];

    $scope.current_state_options = ["q1"]

    $scope.next_state_options = ["q1", "q2"]





//adding to temporary array


	$scope.add_state_to_temporary_array = function($index) {

    	$scope.temp_line_array[0] = "q"+ ($index+1);

	}

	$scope.add_to_temporary_array = function() {

		if($scope.scanning_variable == "0" || $scope.scanning_variable == "1") {
			$scope.temp_line_array[1] = parseInt($scope.scanning_variable)
		}
		else {
			$scope.temp_line_array[1] = $scope.scanning_variable
		}

		if($scope.print_variable == "0" || $scope.print_variable == "1") {
			$scope.temp_line_array[2] = parseInt($scope.print_variable)
		}
		else {
			$scope.temp_line_array[2] = $scope.print_variable
		}

		$scope.temp_line_array[3] = $scope.move_variable

	}


	$scope.add_next_state_to_temporary_array = function($index) {

    	$scope.temp_line_array[4] = "q"+ ($index+1);

	}





	$scope.commit_line = function() {

//add the code line to the program array

		$scope.program.push({

			current_state: $scope.temp_line_array[0],
			current_scanning: $scope.temp_line_array[1],
			print: $scope.temp_line_array[2],
			move: $scope.temp_line_array[3],
			next_state: $scope.temp_line_array[4]

		})


// add to state options if appropriate

        for (u = 0; u < $scope.program.length; u++) {

            if ($scope.current_state_options.indexOf($scope.program[u].next_state) == -1) {

		        $scope.current_state_options.push($scope.program[u].next_state)

		        $scope.next_state_options.push("q"+($scope.next_state_options.length+1))

	        }

        }

    }

//





//delete line from line list

	$scope.show_delete_button = function(e) {

		angular.element(e.target).children(".delete_line_button").show()

	}

	$scope.hide_delete_button = function(e) {

		angular.element(e.currentTarget).children(".delete_line_button").hide()

	}


	$scope.delete_line = function(x) {




//delete from possible states if its no longer possible

        var del_state_num = $scope.program[x].next_state.replace("q","") 

        var max_state_tracker_array = []

        for (var k = 0; k < $scope.program.length; k++) {
			max_state_tracker_array.push(parseInt($scope.program[k].next_state.replace("q","")))
			var max_state = Math.max.apply(null, max_state_tracker_array)
		}

		var index = max_state_tracker_array.indexOf(del_state_num)

		max_state_tracker_array.splice(index,1)


		if (max_state_tracker_array.length > 0) {

			var diff_between_del_state_and_next_max = del_state_num - Math.max.apply(null, max_state_tracker_array)

			if (del_state_num == max_state) {

        		for (diff = 0; diff < diff_between_del_state_and_next_max; diff++) {

        			$scope.current_state_options.pop()

		    		$scope.next_state_options.pop()

		    	}

        	}

        }

        else {

        	$scope.current_state_options = ["q1"]

        	$scope.next_state_options = ["q1","q2"]

        }

    //delete state from staging area if it is no longer an option

        if ($scope.next_state_options.indexOf($scope.temp_line_array[4]) == -1) {

        	$scope.temp_line_array[4] = null

        }

         if ($scope.current_state_options.indexOf($scope.temp_line_array[0]) == -1) {

        	$scope.temp_line_array[0] = null

        }

//



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

	debugger;

		$scope.machine_on = true

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

		if (j<$scope.program.length) {

			if ($scope.reader.state === current_state[j] && $scope.reader.scanning === current_scanning[j]) { //if there is a match in the program

				$scope.cell[$scope.reader.location].content = print[j]; //change the cell to have new content

				move_reader(j, reader_speed)

			}

			else {

				j++;

				$scope.run_program(j);

			}

		}

		else {

			$scope.output();

			$("html").css("overflow","auto")

			$scope.machine_on = false

			return;

		}
		
	}










/////TEMPORARY SPACE





































}]); //close controller

