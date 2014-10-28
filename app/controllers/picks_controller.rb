class PicksController < ApplicationController
  def index
	firebase = Firebase::Client.new("https://popping-inferno-3695.firebaseio.com")
	@governor_races = firebase.get("governor", { })
  end
end
