$("#calculator").bind("pagecreate", function(e) {
    //SETS THE UNIT NUMBERS FOR EACH BOSS
    berzerkerDragonMoloch = [50, 300, 2000, 4000, 10000, 15000, 20000, 30000, 45000, 60000];
    rangerDragonMoloch = [84, 500, 3334, 6667, 16667, 25000, 33334, 50000, 75000, 100000];
    guardianDragonMoloch = [250, 1500, 10000, 20000, 50000, 75000, 100000, 150000, 225000, 300000];
    templarDragonMoloch = [100, 600, 4000, 8000, 20000, 30000, 40000, 60000, 90000, 120000];
    xbowmenDragon = [42, 250, 1700, 3300, 8300, 12500, 17000, 25000, 37500, 50000];
    knightDragon = [19, 112, 756, 1467, 3689, 5556, 7556, 11112, 16667, 22223];
    mageDragonHydra = [36, 215, 1429, 2858, 7143, 10715, 14286, 21429, 32143, 42858];
    warlockDragonHydra = [21, 125, 834, 1667, 4167, 6250, 8334, 12500, 18750, 250000];
    paladinDragon = [28, 167, 1134, 2200, 5534, 8334, 11334, 16667, 25000, 33334];
    xbowmenMolochHydra = [63, 375, 2500, 5000, 12500, 18750, 25000, 37500, 56250, 75000];
    knightMolochHydra = [28, 167, 1112, 2223, 5556, 8334, 11112, 16667, 25000, 33334];
    paladinMolochHydra = [42, 250, 1667, 3334, 8334, 12500, 16667, 25000, 37500, 50000];
    berzerkerHydra = [34, 200, 1360, 2640, 6640, 10000, 13600, 20000, 30000, 40000];
    rangerHydra = [56, 334, 2267, 4400, 11067, 16667, 22667, 33334, 50000, 66667];
    guardianHydra = [168, 1000, 6800, 13200, 33200, 50000, 68000, 100000, 150000, 200000];
    templarHydra = [68, 400, 2720, 5280, 13280, 20000, 27200, 40000, 60000, 80000];
    mageMoloch = [24, 143, 972, 1886, 4743, 7143, 9715, 14286, 21429, 28572];
    warlockMoloch = [14, 84, 567, 1100, 2767, 4167, 5667, 8664, 12500, 16667];
    sloopOctopus = [2, 9, 57, 110, 277, 417, 567, 834, 1250, 1667];
    frigateOctopus = [1, 4, 23, 44, 111, 167, 227, 334, 500, 667];
    galleonOctopus = [1, 1, 6, 11, 28, 42, 57, 84, 125, 167];
    var bossNames=["Hydra","Dragon","Moloch","Octopus"];
	var troopNames=["Zerk","Mage","Ranger","Guardian","Templar","Knight","Warlock","Xbow","Paladin","Frigate","Galleon","Sloop"];
	var troopLand=["Zerk","Mage","Ranger","Guardian","Templar","Knight","Warlock","Xbow","Paladin"];
	var troopSea=["Frigate","Galleon","Sloop"];
	var configNames=["lastBoss","lastLevel","lastTroopType"];
	var currentBoss='Hydra';
	var currentLevel= 1;
	var currentResearch= 0;
	var currentTroop='Zerk';
	var unitsToWin=0;
	var localStorageExists = false;
	//#####################
	//#  INITIALISATION   #
	//#####################

	//DISPLAY BOSS BUTTONS
	renderBossButtons();
	//DISPLAY LEVEL BUTTONS
	renderLevelButtons();
	//DISPLAY LAND TROOPS
	renderLandTroops();
	//DISPLAY LAND TROOPS
	renderSeaTroops();
	//HIDE THE SEA TROOP RADIO BUTTONS
	$('#radioSeaTroops').hide();

	//INITIATE LAWNCHAIR STORAGE
	var researchStore = Lawnchair({name:'research'},function(e){});
	var configStore = Lawnchair({name:'config'},function(e){});
	//researchStore.nuke();
	//configStore.nuke();
	//CHECK WETHER THERE IS ALREADY A STORE FOR RESEARCH VALUES,IF NOT THEN MAKE ONE
	Lawnchair(function(){
	    researchStore.exists('Zerk', function(exists) {
			if(exists){
				console.log('Research Store Exists :)');
				localStorageExists = true;
			}
			else{
				localStorageExists = false;
				for (var i = 0; i < troopNames.length; i++) {
				    researchStore.save({key:troopNames[i],value:0});
				}
				console.log('There is no Research Store :(');
			}
	    })
	})
	//CHECK WETHER THERE IS ALREADY A STORE FOR CONFIG VALUES,IF NOT THEN MAKE ONE
	Lawnchair(function(){
	    configStore.exists('lastBoss', function(exists) {
			if(exists){
				console.log('Config Store Exists :)');
				getConfigFromStore();
				setButtons();
			}
			else{
				console.log('There is no Config Store :(');
				getConfigFromDefaults();
				setDefaultButtons();
			}
	    })
	})
	//DISPLAY THE RESEARCH TABLE
	renderResearchTable();
	//CALCULATE BASED ON DEFAULT RESULTS
	changeBoss();

	//###############
	//#  HANDLERS   #
	//###############

	//SPINNER HANDLER
	$('.spinner').click(function() {
		var newLabel = '';
		var buttonPressed = this.id;
		var stringParts = buttonPressed.split("-");
		var buttonType = stringParts[0];
		var troopType = stringParts[1];
		var inputValue = parseInt($('#res-' + troopType).val());
		//PROCESS DECREMENT BUTTON
		if(buttonType == 'dec'){
			//IF VALUE IS ZERO THEN DO NOTHING
			if(inputValue != 0){
				inputValue--;
				$('#res-' + troopType).val(inputValue);
				storeResearch();
			}
		}
		else{
			//IF VALUE IS 100 THEN DO NOTHING
			if(inputValue != 100){
				inputValue++;
				$('#res-' + troopType).val(inputValue);
				storeResearch();
			}
		}
	});
	//BOSS BUTTON HANDLER
	$('.radioBoss').change(function() {
		changeBoss();
	});
	//BOSS LEVEL BUTTON HANDLER
	$('.btnLevel').click(function() {
		$('.btnLevel').removeClass("ui-btn-active");
		$(this).addClass("ui-btn-active");
		currentLevel = $(this).attr("data-level");
		storeConfig();
		calculateResult();
	});
	//LAND TROOP BUTTON HANDLER
	$('.landTroops').change(function() {
		currentTroop = $('.landTroops:checked').val();
		storeConfig();
		calculateResult();
	});
	//SEA TROOP BUTTON HANDLER
	$('.seaTroops').change(function() {
		currentTroop = $('.seaTroops:checked').val();
		storeConfig();
		calculateResult();
	});
	//RESEARCH VALUES CHANGE HANDLER
	$('.researchValues').change(function() {
		storeResearch();
	});

	//###############
	//#  FUNCTIONS  #
	//###############
	function changeBoss() {
		currentBoss = $('.radioBoss:checked').val();
		console.log('currentLevel is ' + currentLevel);
		if(currentBoss == 'Octopus'){
			currentTroop = $('.seaTroops:checked').val();
			$('#radioSeaTroops').show();
			$('#radioLandTroops').hide();
		}
		else{
			currentTroop = $('.landTroops:checked').val();
			$('#radioSeaTroops').hide();
			$('#radioLandTroops').show();
		}
		storeConfig();
		calculateResult();
	}
	//STORE CONFIG
	function storeConfig() {
        configStore.save({key:"lastBoss",value:currentBoss});
        configStore.save({key:"lastLevel",value:currentLevel});
        configStore.save({key:"lastTroopType",value:currentTroop});
	}
	//STORE RESEARCH BONUSES
	function storeResearch() {
		for (var i = 0; i < troopNames.length; i++) {
			curKey = troopNames[i];
			curValue = $('#res-' + troopNames[i]).val();
			console.log(curKey + ' = ' + curValue);
			researchStore.save({key:curKey,value:curValue});
		}
		calculateResult();				
	}
	//SET GLOBAL VARS TO EQUIVALENT STORED VARS
	function getConfigFromStore() {
			configStore.get("lastBoss",function(obj){
			currentBoss = obj.value;
		});
			configStore.get("lastLevel",function(obj){
			currentLevel = obj.value;
		});
			configStore.get("lastTroopType",function(obj){
			currentTroop = obj.value;
		});
	}
	//SET BUTTONS BASED ON GLOBAL VARS
	function setButtons() {
		//SET DEFAULT BOSS
		$('#radioBoss-'+currentBoss).prop("checked","true");
		//SET DEFAULT LEVEL BUTTON TO 1
		$('#btnLevel-'+currentLevel).addClass("ui-btn-active");
		//SET DEFAULT LAND TROOP TYPE TO ZERK
		$('#radioTroops-'+currentTroop).prop("checked","true");
		//SET DEFAULT SEA TROOP TYPE TO FRIGATE
		$('#radioTroops-Frigate').prop("checked","true");
	}
	//SET CONFIG STORE TO DEFAULTS
	function getConfigFromDefaults(){
        configStore.save({key:"lastBoss",value:"Hydra"});
        configStore.save({key:"lastLevel",value:1});
        configStore.save({key:"lastTroopType",value:"Zerk"});
	}
	//SET BUTTONS BASED ON DEFAULTS
	function setDefaultButtons(){
		//SET DEFAULT BOSS TO HYDRA
		$('#radioBoss-Hydra').prop("checked","true");
		//SET DEFAULT LEVEL BUTTON TO 1
		$('#btnLevel-1').addClass("ui-btn-active");
		//SET DEFAULT LAND TROOP TYPE TO ZERK
		$('#radioTroops-Zerk').prop("checked","true");
		//SET DEFAULT SEA TROOP TYPE TO FRIGATE
		$('#radioTroops-Frigate').prop("checked","true");
	}
	//CALCULATE THE RESULTS AND OUPUT THEM TO THE SCREEN
	function calculateResult() {
        console.log(currentTroop);
        calculateUnitsToWin();
        calculateResearchBonus();
        outputAnswer();
		//$('#footerDiv').html(currentBoss + ' ' + currentLevel + ' ' + currentTroop);
	};
	//OUTPUT RESULTS TO THE SCREEN
	function outputAnswer() {
		descriptionText1 = 'Level ' + currentLevel + ' ' + currentBoss;
        $('#description1').text(descriptionText1);
		descriptionText2 = currentTroop + ' @ ' + currentResearch +'%';
        $('#description2').text(descriptionText2);
        $('#guaranteed').text(commaSeparateNumber(unitsToWin));
        $('#seventyFive').text(commaSeparateNumber(calculatePercentage(unitsToWin, 56.25)));
        $('#fifty').text(commaSeparateNumber(calculatePercentage(unitsToWin, 25)));
        $('#twentyFive').text(commaSeparateNumber(calculatePercentage(unitsToWin, 12.5)));
	}
	//CALCULATE LESS THAN GUARANTEED BOSS KILL
	function calculatePercentage(fullUnits, percentage) {
	    var number = fullUnits;
	    var percent = percentage;
	    var result = (number / 100) * percent;
	    return Math.ceil(result);
	}
	//CALCULATE RESEARCH BONUS
	function calculateResearchBonus() {
	    var researchVal = 0;
			researchStore.get(currentTroop,function(obj){
			researchVal = obj.value;
		});
	    unitsToWin = Math.ceil(unitsToWin/(1+researchVal/100));
	    currentResearch = researchVal;
	}
	//COMMA SEPERATE THE NUMBER
	function commaSeparateNumber(val){
		while (/(\d+)(\d{3})/.test(val.toString())){
			val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
		}
		return val;
	}
	//RENDER BOSS BUTTONS
	function renderBossButtons(){
		for (var i = 0; i < bossNames.length; i++){
			bossText = '';
			bossText += '<input type="radio" name="radioBoss" class="radioBoss"'
			bossText += ' id="radioBoss-'+bossNames[i]+'" value="'+bossNames[i]+'" />';
			bossText += '<label for="radioBoss-'+bossNames[i]+'">'+bossNames[i]+'</label>'
			$('#bossRow').append(bossText);
		}
	}
	//RENDER LEVEL BUTTONS
	function renderLevelButtons(){
		for (var i = 1; i < 11; i++) {
			lvlText = '';
			lvlText += '<a id="btnLevel-'+i+'" data-level="'+i+'" href="#" data-role="button" class="btnLevel">'+i+'</a>';
			if(i < 6){
				$('#btnLevelTopRow').append(lvlText);
			}
			else{
				$('#btnLevelBottomRow').append(lvlText);
			}
		}
	}
	//RENDER LAND TROOPS BUTTONS
	function renderLandTroops(){
		for (var i = 0; i < troopLand.length; i++){
			troopText = '';
			troopText += '<input type="radio" name="landTroops" class="landTroops"';
			troopText += ' id="radioTroops-'+troopLand[i]+'" value="'+troopLand[i]+'" />';
			troopText += '<label for="radioTroops-'+troopLand[i]+'" id="label-'+troopLand[i]+'">'+troopLand[i]+'</label>';
			$('#radioLandTroops').append(troopText);
		}
	}
	//RENDER SEA TROOPS BUTTONS
	function renderSeaTroops(){
		for (var i = 0; i < troopSea.length; i++){
			troopText = '';
			troopText += '<input type="radio" name="seaTroops" class="seaTroops"';
			troopText += ' id="radioTroops-'+troopSea[i]+'" value="'+troopSea[i]+'" />';
			troopText += '<label for="radioTroops-'+troopSea[i]+'" id="label-'+troopSea[i]+'">'+troopSea[i]+'</label>';
			$('#radioSeaTroops').append(troopText);
		}
	}
	//RENDER RESEARCH TABLE 
	function renderResearchTable() {
		for (var i = 0; i < troopNames.length; i++) {
				researchStore.get(troopNames[i],function(obj){
				researchVal = obj.value;
			});
			var resText = '';
			resText = resText + '<tr>';
			resText = resText + '<td>';
			resText = resText + '<a id="dec-' + troopNames[i] + '"';
			resText = resText + ' class="spinner" href="#" data-role="button"';
			resText = resText + ' data-inline="true" data-icon="minus" data-iconpos="notext">';
			resText = resText + '</a>';
			resText = resText + '</td>';
			resText = resText + '<td>';
			resText = resText + '<input id="res-' + troopNames[i] + '" class="researchValues"';
			resText = resText + ' maxlength="3" type="text" style="width:50px" value="' + researchVal + '" />';
			resText = resText + '</td>';
			resText = resText + '<td>';
			resText = resText + '<a id="inc-' + troopNames[i] + '"';
			resText = resText + ' class="spinner" href="#" data-role="button"';
			resText = resText + ' data-inline="true" data-icon="plus" data-iconpos="notext">';
			resText = resText + '</a>';
			resText = resText + '</td>';
			resText = resText + '<td>';
			resText = resText + troopNames[i];
			resText = resText + '</td>';
			resText = resText + '</tr>';
		    $('#researchTable').append(resText);
		}
	}
	//CALCULATE THE ANSWER BASED ON THE USER SELECTIONS OF BOSS, LEVEL AND TROOP TYPE
	function calculateUnitsToWin() {
	    if (currentBoss == 'Dragon' || currentBoss == 'Moloch') {
            if (currentTroop == 'Zerk') {
                unitsToWin = berzerkerDragonMoloch[currentLevel-1];
            }
            if (currentTroop == 'Ranger') {
                unitsToWin = rangerDragonMoloch[currentLevel-1];
            }
            if (currentTroop == 'Guardian') {
                unitsToWin = guardianDragonMoloch[currentLevel-1];
            }
            if (currentTroop == 'Templar') {
                unitsToWin = templarDragonMoloch[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Dragon') {
            if (currentTroop == 'Xbow') {
                unitsToWin = xbowmenDragon[currentLevel-1];
            }
            if (currentTroop == 'Knight') {
                unitsToWin = knightDragon[currentLevel-1];
            }
            if (currentTroop == 'Paladin') {
                unitsToWin = paladinDragon[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Hydra' || currentBoss == 'Moloch') {
            if (currentTroop == 'Xbow') {
                unitsToWin = xbowmenMolochHydra[currentLevel-1];
            }
            if (currentTroop == 'Knight') {
                unitsToWin = knightMolochHydra[currentLevel-1];
            }
            if (currentTroop == 'Paladin') {
                unitsToWin = paladinMolochHydra[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Hydra') {
            if (currentTroop == 'Zerk') {
                unitsToWin = berzerkerHydra[currentLevel-1];
            }
            if (currentTroop == 'Ranger') {
                unitsToWin = rangerHydra[currentLevel-1];
            }
            if (currentTroop == 'Guardian') {
                unitsToWin = guardianHydra[currentLevel-1];
            }
            if (currentTroop == 'Templar') {
                unitsToWin = templarHydra[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Hydra' || currentBoss == 'Dragon') {
            if (currentTroop == 'Mage') {
                unitsToWin = mageDragonHydra[currentLevel-1];
            }
            if (currentTroop == 'Warlock') {
                unitsToWin = warlockDragonHydra[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Moloch') {
            if (currentTroop == 'Mage') {
                unitsToWin = mageMoloch[currentLevel-1];
            }
            if (currentTroop == 'Warlock') {
                unitsToWin = warlockMoloch[currentLevel-1];
            }
	    }
	    if (currentBoss == 'Octopus') {
            if (currentTroop == 'Sloop') {
                unitsToWin = sloopOctopus[currentLevel-1];
            }
            if (currentTroop == 'Frigate') {
                unitsToWin = frigateOctopus[currentLevel-1];
            }
            if (currentTroop == 'Galleon') {
                unitsToWin = galleonOctopus[currentLevel-1];
            }
	    }
	}
})
