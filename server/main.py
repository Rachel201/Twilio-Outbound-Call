import os
import uuid
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from gevent.tests.test__issue6 import p
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import SyncGrant
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml.voice_response import VoiceResponse, Dial

load_dotenv()
app = Flask(__name__)
CORS(app)

account_sid = os.environ['TWILIO_ACCOUNT_SID']
api_key = os.environ['TWILIO_API_KEY']
api_key_secret = os.environ['TWILIO_API_SECRET']
twiml_app_sid = os.environ['TWILIO_TWIML_APP_SID']
twilio_number = os.environ['FROM_NUMBER']

@app.route('/token', methods=['GET'])
def get_token():
    identity = twilio_number
    outgoing_application_sid = twiml_app_sid

    access_token = AccessToken(account_sid, api_key,
                               api_key_secret, identity=identity)

    voice_grant = VoiceGrant(
        outgoing_application_sid=outgoing_application_sid,
        incoming_allow=True,
    )
    access_token.add_grant(voice_grant)

    response = jsonify(
        {'token': access_token.to_jwt().decode(), 'identity': identity})
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response



@app.route('/handle_calls', methods=['POST'])
def call():
    p.pprint(request.form)
    response = VoiceResponse()
    dial = Dial(callerId=twilio_number)

    if 'To' in request.form and request.form['To'] != twilio_number:
        print('outbound call')
        dial.number(request.form['To'])
    else:
        print('incoming call')
        caller = request.form['Caller']
        dial = Dial(callerId=caller)
        dial.client(twilio_number)

    return str(response.append(dial))


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3002, debug=True)