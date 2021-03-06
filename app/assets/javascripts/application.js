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
		$.each($('#governor td input'), function(i,val) {
			if (val.checked) {
				governor_picks.push([val.name,val.value]);
			}
		});
		$.each($('#senate td input'), function(i,val) {
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
			$( "#notice" ).html( data.message ).show().delay(2000).fadeOut(1000);
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
			if (data.entry.governor_picks || data.entry.senate_picks) {
				if (data.entry.governor_picks) {
					$.each(data.entry.governor_picks, function(i,val) {
						$("#governor td input[name=" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
						// stupid bug fix for when i messed up the names and people had already submitted data
						$("#governor td input[name=g_" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
					});
				}
				if (data.entry.senate_picks) {
					$.each(data.entry.senate_picks, function(i,val) {
						$("#senate td input[name=" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
						// stupid bug fix for when i messed up the names and people had already submitted data
						$("#senate td input[name=s_" + val[0] + "][value=" + val[1] + "]").prop('checked', true);
					});
				}
			}
		});	
	});
});