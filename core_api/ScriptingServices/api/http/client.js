/* globals $ java */
/* eslint-env node, dirigible */

exports.get = function(url, options) {
	return handleRequest(url, 'GET', options);
};

exports.post = function(url, options) {
	return handleRequest(url, 'POST', options);
};

exports.put = function(url, options) {
	return handleRequest(url, 'PUT', options);
};

exports.delete = function(url, options) {
	return handleRequest(url, 'DELETE', options);
};

exports.request = function(options) {
	return handleRequest(null, options.method, options);
};

function handleRequest(url, method, options) {
    if (url === null) {
	    url = options.host + ":" + (options.port ? options.port : 80) + (options.path ? options.path : '/');
    }
    if (method === null) {
        method = "GET";
    }
    
	var request = createRequest(method, url);
	if (options) {
	    addHeaders(request, options.headers);
    }


	var httpClient = $.getHttpUtils().createHttpClient(true);
	return createResponse(httpClient.execute(request), options);
}

function createRequest(method, url) {
	var request = null;
	switch(method) {
		case 'POST':
			request = $.getHttpUtils().createPost(url);
			break;
		case 'PUT':
			request = $.getHttpUtils().createPut(url);
			break;
		case 'DELETE':
			request = $.getHttpUtils().createDelete(url);
			break;
		default:
			request = $.getHttpUtils().createGet(url);
	}
	return request;
}

function addHeaders(httpRequest, headers) {
	for (var nextHeader in headers) {
		httpRequest.addHeader(nextHeader, headers[nextHeader]);
	}
}

function createResponse(httpResponse, options) {
	return {
		'statusCode': httpResponse.getStatusLine().getStatusCode(),
		'statusMessage': httpResponse.getStatusLine().getReasonPhrase(),
		'data': getResponseData(httpResponse, options),
		'httpVersion': httpResponse.getProtocolVersion(),
		'headers': getResponseHeaders(httpResponse)
	};
}

function getResponseData(httpResponse, options) {
    var entity = httpResponse.getEntity();
    var content = entity.getContent();

    var data = $.getIOUtils().toByteArray(content);

    $.getHttpUtils().consume(entity);
    var isBinary = false;
    if (options) {
        isBinary = options.binary;
    }

    return isBinary ? data : new java.lang.String(data);
}

function getResponseHeaders(httpResponse) {
	var headers = [];
	var httpResponseHeaders = httpResponse.getAllHeaders();
	for (var i = 0; i < httpResponseHeaders.length; i ++) {
		var header = httpResponseHeaders[i];
		headers.push({
			'name': header.getName(),
			'value': header.getValue()
		});
	}
	return headers;
}