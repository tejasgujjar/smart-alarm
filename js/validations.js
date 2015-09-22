function IsNumeric(numericVal) {
	var numericRegExp = new RegExp("^[0-9]+$");
	if(numericVal.match(numericRegExp)) {
		return true;
	} else {
		return false;
	}
}

function IsAlphabetic(alphabeticVal) {
	var alphabeticRegExp = new RegExp("^[A-z]+$");
	if(alphabeticVal.match(alphabeticRegExp)) {
		return true;
	} else {
		return false;
	}
}

function IsNull(reqFieldVal) {
	if(reqFieldVal.length == 0) {
		return true;
	} else {
		return false;
	}
}

function IsAlphabeticWithHiphen(alphaHiphenVal) {
	var alphaHiphenRegExp = new RegExp("^[A-z0-9]+$");
	if(alphaHiphenVal.match(alphaHiphenRegExp)) {
		return true;
	} else {
		return false;
	}
}

function IsAlphaNumeric(alphaNumericVal) {
	var alphaNumericRegExp = new RegExp("^[A-z0-9]+$");
	if(alphaNumericVal.match(alphaNumericRegExp)) {
		return true;
	} else {
		return false;
	}
}

function IsOnlyAlphaNumeric(alphaNumericVal){
	var alphaNumericRegExp = new RegExp("[a-zA-Z][0-9]|[0-9][a-zA-Z]");
	if(alphaNumericVal.match(alphaNumericRegExp)) {
		return true;
	} else {
		return false;
	}
}

function checkLength(length, maxlength) {
	if(length != maxlength) {
		return false;
	} else {
		return true;
	}
}
function getMaxlength(inputEle) {
	var maxlength = $('#' + inputEle).attr('maxlength');
	return maxlength;
}

function IsAlphabeticWithSpace(alphaWithSpaceVal) {
	var alphaSpaceRegExp = new RegExp("^[a-zA-Z][a-zA-Z ]*$");
	if(alphaWithSpaceVal.match(alphaSpaceRegExp)) {
		return true;
	} else {
		return false;
	}
}