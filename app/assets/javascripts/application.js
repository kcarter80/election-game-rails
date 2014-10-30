// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .

$( document ).ready(function() {

	$( "#submit" ).on( "click", function() {
		var governor_picks = [];
		var senate_picks = [];
		$.each($('#governor li input'), function(i,val) {
			if (val.checked) {
				governor_picks.push([val.name,val.value]);
			}
		});
		$.each($('#senate li input'), function(i,val) {
			if (val.checked) {
				senate_picks.push([val.name,val.value]);
			}
		});

		$.ajax({
			type: 'POST',
			url: "/races",
			data: {
				email: $("#email").val(),
				password: $("#password").val(),
				governor_picks: governor_picks,
				senate_picks: senate_picks
			}
		}).done(function(data) {
			$( "#notice" ).append( data.message );
		});	
	});

	$( "#retrieve" ).on( "click", function() {
		$.ajax({
			type: 'GET',
			url: "/races",
			data: {
				email: $("#email").val(),
				password: $("#password").val()
			}
		}).done(function(data) {
			$( "#notice" ).html( data.message ).show().delay(2000).fadeOut(1000);
			$.each(data.entry.governor_picks, function(i,val) {
				$("#governor li input[name=" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
			});
			$.each(data.entry.senate_picks, function(i,val) {
				$("#senate li input[name=" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
			});
		});	
	});
});