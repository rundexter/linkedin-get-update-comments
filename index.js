var Linkedin = require('node-linkedin')(),
    _ = require('lodash'),
    util = require('./util.js');
// SET Input && Output structure
var pickInputs = {
        'id': { key: 'id', validate: { req: true } },
        'updateKey': { key: 'updateKey', validate: { req: true } }
    },
    pickOutputs = {
        'total': '_total',
        'id': {
            keyName: 'values',
            fields: ['id']
        },
        'comment': {
            keyName: 'values',
            fields: ['comment']
        },
        'timestamp': {
            keyName: 'values',
            fields: ['timestamp']
        },
        'user_id': {
            keyName: 'values',
            fields: ['person.id']
        },
        'firstName': {
            keyName: 'values',
            fields: ['person.firstName']
        },
        'lastName': {
            keyName: 'values',
            fields: ['person.lastName']
        }
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = Linkedin.init(dexter.provider('linkedin').credentials('access_token')),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        linkedIn.companies.createCall('GET', 'companies/' + inputs.id + '/updates/key=' + inputs.updateKey + '/update-comments', _.omit(inputs, ['id']), function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(util.pickOutputs(data, pickOutputs));

        }.bind(this))(linkedIn.companies.config);
    }
};
