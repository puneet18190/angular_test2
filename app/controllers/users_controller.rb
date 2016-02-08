class UsersController < ApplicationController
	respond_to :html, :json

	def create
		binding.pry
		# @student = Student.new(student_params)
		# if @student.save
	    	render json: {data: @student.as_json, status: "true"}.to_json
	    # else
	    # 	render json: {data: @student.errors, status: "false"}.to_json
	    # end
	end

	# protected

	# def student_params
	# 	params.require(:user).permit(:ema, :phone, :address)
	# end


end
