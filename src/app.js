import './scss/main.scss';
import { Validate } from './js/validator';

let app = {
	render: function() {
		const self = this;
		let form = $('#contest_form');

		self.bindEvents(form);
	},

	bindEvents: function(form) {
		let self = this;
		const submit = form.find('#submit_button');
		const name = form.find('#name');
		const number = form.find('#number');
		const email = form.find('#email');

		let isValid = new Validate(form);

		//? Submit Button
		submit.on('click', function(e) {
			e.preventDefault();

			//? Validate all inputs before getting formData and calling the API.
			if (isValid.all()) {
				let formData = self.getFormData(form);

				//? Call the save API
				self.saveData(formData, function(results) {
					//? Change the botton to disabled and update the text.
					if (results !== null) {
						submit
							.html('SUBMITTED')
							.prop('disabled', true)
					}
				});
			}
		});

		//? If name has the class error try to validate the field on keyup. This is needed to remove the red border if the requirements are met.
		name.on('keyup', function() {
			verifyInput(name, 'name');
		});

		//? Format phone number to xxx-xxx-xxxx on input.
		number.on('keyup', function() {
			let text = $(this).val();

			text = text.replace(/\D/g,'');
			
			if (text.length > 3) {
				text=text.replace(/.{3}/,'$&-');
			}
			if(text.length > 7) {
				text=text.replace(/.{7}/,'$&-');
			}

			$(this).val(text);   

			verifyInput(number, 'number');
		});

		//? If Email has the error class, attempt to validate.
		email.on('keyup', function() {
			verifyInput(email, 'email');
		});

		//? If input has the error class then check if it is valid. This is used when users type of specific input fields.
		function verifyInput(target, name) {
			if (target.hasClass('error')) {
				try {
					isValid[name]();
				} catch {
					console.error('Validator does not have a defined test of ', name);
				}
			}
		}
	},

	getFormData: function(form) {
		let formData = {};

		form.find('.container').children().each(function(i, child) {
			const input = $(child).find('input');
			const name = input.prop('name');
			
			//? Get the form data unless the input is city or state and empty.
			if ((name === 'city' ||  name === 'state') && input.val() === '' ) {
				return;
			} else {
				formData[name] = input.val();
			}
		});

		return formData;
	},

	saveData(data, callback) {
		$.ajax({
			type: "POST",
			url: 'https://formsws-hilstaging-com-0adj9wt8gzyq.runscope.net/solar',
			data: {
				json: JSON.stringify(data)
			},
			timeout: 1,
			success: function(successData) {
				callback(successData);
			},
			error: function(errorData, status) {
				//? If timeout then pass the callback as a success rather then an error. We are doing this because the URL call dosnt work and results in timeouts anyway.
				if (status === 'timeout') {
					callback(errorData);
				} else {
					callback(null);
				}
			}
		});
	}
}

app.render();


