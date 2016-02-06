class StudentsController < ApplicationController
	respond_to :html, :json

	def index
		@students = Student.all
		respond_with(@students) do |format|
	      format.json { render :json => @students.as_json }
	      format.html
	    end
	end

	def show
		@students = Student.find(params[:id])
		respond_with(@students) do |format|
	      format.json { render :json => @students.as_json }
	      format.html
	    end
	end

	def create
		@student = Student.new(student_params)
		if @student.save
	    	render json: {data: @student.as_json, status: "true"}.to_json
	    else
	    	render json: {data: @student.errors, status: "false"}.to_json
	    end
	end

	def update
		@student = Student.find(params[:id])
		if @student.update(student_params)
	    	render json: {data: @student.as_json, status: "true"}.to_json
	    else
	    	render json: {data: @student.errors, status: "false"}.to_json
	    end
	end

	def destroy
		@student = Student.find(params[:id])
		if @student.delete
	    	render json: {data: @student.as_json, status: "true"}.to_json
	    else
	    	render json: {data: @student.errors, status: "false"}.to_json
	    end
	end

	protected

	def student_params
		params.require(:student).permit(:name, :phone, :address)
	end


end
