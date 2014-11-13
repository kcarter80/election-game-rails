class PicksController < ApplicationController
	before_filter :setup_firebase

	def setup_firebase
  	# sets up a new Firebase client
		@firebase = Firebase::Client.new("https://popping-inferno-3695.firebaseio.com")		
	end

	def validate_inputs
		params[:email].strip!
		params[:password].strip!
   	return params[:email].length > 3 && params[:password].length > 3
	end

  def index
		# queries Firebase and parses the returned JSON
		results = JSON.parse @firebase.get("", { }).response.response_body
		# sort the races alphabetically
		@governor_races = results["governor"].sort_by { |key, race| race }
		@senate_races = results["senate"].sort_by { |key, race| race }
  end

  def post_races
  	if !validate_inputs
			render json: {message: "Email and password must be at least 3 characters."} and return
		end

  	# queries Firebase and parses the returned JSON
		entries = JSON.parse @firebase.get("/picks", { }).response.response_body	
		found = false
		# need to iterate through to find the email
		entries.each do |key,value|
			if (params[:email] == value["email"])
				found = true
				#email and password match
				if (params[:password] == value["password"])
					puts key
					#TODO: update previous!
					@firebase.update("/picks/" + key, Hash["governor_picks", params[:governor_picks], "senate_picks", params[:senate_picks]])
				# email match, but password mismatch
				else
					render json: {message: "Incorrect password."} and return
				end
				# no longer need to go through the picks
				break
			end
		end

		# email is new
		if (!found)
			@firebase.push("/picks", Hash["email",params[:email],"password",params[:password], "governor_picks", params[:governor_picks], "senate_picks", params[:senate_picks]])
		end

  	render json: {message: "Picks submitted."}
  end

  def get_races
  	if !validate_inputs
			render json: {message: "Email and password must be at least 3 characters."} and return
		end

  	# queries Firebase and parses the returned JSON
		entries = JSON.parse @firebase.get("/picks", { }).response.response_body

		# need to iterate through to find the email
		entries.each do |key,value|
			if (params[:email] == value["email"])
				#email and password match
				if (params[:password] == value["password"])
					render json: {message: "Picks retrieved.", entry: value} and return
				# email match, but password mismatch
				else
					render json: {message: "Incorrect password."} and return
				end
			end
		end
		# email not found
		render json: {message: "No picks found for email."} and return
  end

  def generate_results

	require 'csv'

	@firebase = Firebase::Client.new("https://popping-inferno-3695.firebaseio.com")

	results = JSON.parse @firebase.get("", { }).response.response_body

	governor_race_id_strings = []
	senate_race_id_strings = []

	CSV.open('results.csv','w') do |csv|
		header = ['email']
		results['governor'].each do |key, value|
			header << value
			governor_race_id_strings << 'g_' + key
		end
		results['senate'].each do |key, value|
			header << value
			senate_race_id_strings << 's_' + key
		end
		csv << header


		results['picks'].each do |key,value|
			selections = [value['email']]

			governor_picks = Hash[value['governor_picks'].map {|k,v| [k,v]}]
			senate_picks = Hash[value['senate_picks'].map {|k,v| [k,v]}]

			governor_race_id_strings.each do |race_id|
				if governor_picks.has_key?(race_id)
					selections << governor_picks[race_id]
				else
					selections << '-'
				end
			end

			senate_race_id_strings.each do |race_id|
				if senate_picks.has_key?(race_id)
					selections << senate_picks[race_id]
				else
					selections << '-'
				end
			end

			csv << selections
		end
	end

  end
end