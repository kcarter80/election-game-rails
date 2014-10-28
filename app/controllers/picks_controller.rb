class PicksController < ApplicationController
  def index
	firebase = Firebase::Client.new("https://popping-inferno-3695.firebaseio.com")

	results = JSON.parse firebase.get("", { }).response.response_body
	@governor_races = results["governor"].compact.sort!
	@senate_races = results["senate"].compact.sort!
  end
end
