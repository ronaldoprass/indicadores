google.load('visualization', '1.0', {'packages':['corechart', 'table']});

$(document).ready(function(){
	function success(position){
		var geocoder = new google.maps.Geocoder();
		var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		if (geocoder) {
			geocoder.geocode({ 'latLng': point }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						var componentesAddress = results[0].address_components;
						for(var i=0; i<componentesAddress.length; i++){
							if(componentesAddress[i].types[0] == 'locality' && componentesAddress[i].types[1] == 'political'){
								var cidade = componentesAddress[i].long_name;
								cidade = retirarAcento(cidade.toUpperCase());
								$("#cidade option[value='"+cidade+"']").attr('selected', true);
								
								hoje = new Date();
								mes = ((hoje.getMonth())+1);
								if( mes < 10 ){
									mes = "0" + mes.toString();
								}
								ano = hoje.getFullYear();
								
								$("#dataInicial option[value='"+ "01-" + ano +"']").attr('selected', true);
								$("#dataFinal option[value='"+ mes + "-" + ano +"']").attr('selected', true);
								
								carregaDadosPizzaGrid();
								break;
							}
						}
					} 
				}
			});
		} 
	}

	
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success);	
	}
	
	function carregaCidades(){
		$.ajax({
			url:"json/cidade.json",
			dataType:"json",
			error:function(a,b,c){
				alert("Erro ao buscar lista de cidades");
			},
			success:function(dados){
				var option = "<option value='Rio Grande do Sul'>Rio Grande do Sul</option>";
				for( var i=0; i<dados.length; i++){
					option += "<option value='" + dados[i].municipio + "'>" + dados[i].municipio + "</option>";
				}
				$("select#cidade").removeAttr('disabled').html(option);
			}
		});
	}
	carregaCidades();
	
	$( "#confirmaHome" ).click(function(){
		carregaDadosPizzaGrid();
	});
	
	function carregaDadosPizzaGrid(){
		var cidade = $("#cidade").val();
		var dataIni = $("#dataInicial").val();
		var dataFin = $("#dataFinal").val();
		
		$.ajax({
			url:"json/pizzaGrid.json",
			data:{
				param: "qtoco",
				ini: dataIni,
				fin: dataFin,
				muni: cidade
			},
			dataType:"json",
			jsonp:"callback",
			timeout:"30000",
			type:"post",
			error:function(a,b,c){
				alert("Erro ao buscar dados para alimentar os gráficos");
			},
			success:function(dados){
				arrayResultado = new Array();
				for( var i=0; i<dados.length; i++){
					arrayResultado.push( [
											dados[i].ocorrencia,
											dados[i].quantidade
										  ] );
				}
				pizzaHome( arrayResultado, cidade );
				gridHome( arrayResultado, cidade );
				
				linhaHome();
			}
		});
		
	}
	
	function retirarAcento(texto) {
		var varString = new String(texto);
		var stringAcentos = new String('àâêôûãõáéíóúçüÀÂÊÔÛÃÕÁÉÍÓÚÇÜ');
		var stringSemAcento = new String('aaeouaoaeioucuAAEOUAOAEIOUCU');
		 
		var i = new Number();
		var j = new Number();
		var cString = new String();
		var varRes = '';
		 
		for (i = 0; i < varString.length; i++) {
			cString = varString.substring(i, i + 1);
			for (j = 0; j < stringAcentos.length; j++) {
				if (stringAcentos.substring(j, j + 1) == cString){
					cString = stringSemAcento.substring(j, j + 1);
				}
			}
			varRes += cString;
		}
		return varRes;
	}
	
});

function pizzaHome( dados, cidade ){
	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Ocorrência');
	data.addColumn('number', 'Quantidade');
	data.addRows( dados );
	// Set chart options
	var options = {'title':'Quantidade de ocorrências - ' + cidade,
				   'width':480,
				   'height':280,
				   'is3D':true};
	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('pizzaHome'));
	chart.draw(data, options);
}

function gridHome( dados, cidade){
	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Ocorrência');
	data.addColumn('number', 'Quantidade');
	data.addRows(dados);
	// Set chart options
	var options = {'title':'Quantidade de ocorrências - ' + cidade,
				   'width':480,
				   'height':280
				   };
	// Instantiate and draw our chart, passing in some options.
	var table = new google.visualization.Table(document.getElementById('gridHome'));
	table.draw(data, options);
}

function linhaHome(){
	var data2 = google.visualization.arrayToDataTable([
	['Mês', 'Roubos', 'Assaltos', 'Furtos'],
	['Jan-2012', 231, 200, 180],
	['Fev-2012', 200, 189, 195],
	['Mar-2012', 185, 190, 196],
	['Abr-2012', 198, 200, 185],
	['Fev-2012', 200, 189, 195],
	['Mar-2012', 185, 190, 196],
	['Abr-2012', 198, 200, 185],
	['Mai-2012', 160, 190, 165],
	['Fev-2012', 200, 189, 195],
	['Mar-2012', 185, 190, 196],
	['Abr-2012', 198, 200, 185],
	['Mai-2012', 160, 190, 165],
	['Fev-2012', 200, 189, 195],
	['Mar-2012', 185, 190, 196],
	['Abr-2012', 198, 200, 185]
	]);
	
	var options = {title:'Quantidade de ocorrencias por mês no Rio Grande do Sul',
				   tooltip:{
				   textStyle: {
						color: '#333333',
						fontSize: '10px'
				   },
				   showColorCode: true
				   },
				   colors: ['#D62222', '#FAEA12', '#499D2C'],
				   fontSize: 11,
				   'width':966,
				   'height':300};
	
	var chart2 = new google.visualization.AreaChart(document.getElementById('linhaHome'));
	chart2.draw(data2, options);
}