http = require 'http'
https = require 'https'
querystring = require 'querystring'

class ClientLogin
	constructor: (username, password, service, accountType='HOSTED_OR_GOOGLE') ->
		@username = username
		@password = password
		@service = service
		@accountType = accountType
		
	authorize: (callback) ->
		self = @
		postData = querystring.stringify({
			'Email': @username,
			'Passwd': @password,
			'service': @service,
			'accountType': @accountType
		})
		options = host: 'www.google.com', path: '/accounts/ClientLogin', port: 443, method: 'POST', headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}

		req = https.request options, (res) ->
			data = ''
			res.setEncoding 'utf-8'
			res.on 'data', (chuck) ->
				data += chuck
				
			res.on 'end', ->
				self.sid = data.split('SID=')[1].split('Auth')[0]
				self.authToken = data.split('Auth=')[1]
				callback()
				
		req.write postData
		req.end()
			
module.exports = ClientLogin