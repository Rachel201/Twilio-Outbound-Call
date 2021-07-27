import os
import uuid
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import SyncGrant

load_dotenv()
app = Flask(__name__)
CORS(app)


@app.route('/token', methods=['POST'])
def token():
    token = AccessToken(os.environ['TWILIO_ACCOUNT_SID'],
                        os.environ['TWILIO_API_KEY_SID'],
                        os.environ['TWILIO_API_KEY_SECRET'],
                        grants=[SyncGrant(os.environ['TWILIO_SYNC_SERVICE_SID'])],
                        identity=uuid.uuid4().hex)
    return {'token': token.to_jwt().decode()}



