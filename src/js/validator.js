export class Validate {
    constructor(form) {
        this.form = form;
        this.errors = {};

        return this;
    };

    all() {
        this.name();
        this.number();
        this.email();

        return Object.keys(this.errors).length === 0;
    }

    name() {        
        check.isLessThan('name', 2, this);
    };

    number() {
        check.isLessThan('number', 12, this);
    }

    email() {
        check.isEmail(this);
    }
}

var check = {
    isLessThan: function(id, len, validator) {
        const input = $(validator.form).find('#' + id);
        let test = input.val().length < len;

        this.isValid(test, input, id, validator);
    },

    isEmail: function(validator) {
        const input = $(validator.form).find('#email');
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test = !re.test(input.val());

        this.isValid(test, input, 'email', validator);
    },

    isValid: function(test, input, id, validator) {
        if (test) {
            input.addClass('error');

            validator.errors[id] = true;
        } else {
            input.removeClass('error');

            delete validator.errors[id];
        }
    }
};