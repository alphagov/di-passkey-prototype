// 
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
// 

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const randomBytes = require('node:crypto').randomBytes;

// Add your routes here

// alg codes from https://www.iana.org/assignments/cose/cose.xhtml
const CRED_PARAMS = [
    { 'alg': -257, 'type': 'public-key' },
    { 'alg': -7, 'type': 'public-key' },
    { 'alg': -35, 'type': 'public-key' },
    { 'alg': -36, 'type': 'public-key' },
    { 'alg': -258, 'type': 'public-key' },
    { 'alg': -259, 'type': 'public-key' },
    { 'alg': -37, 'type': 'public-key' },
    { 'alg': -38, 'type': 'public-key' },
    { 'alg': -39, 'type': 'public-key' },
    { 'alg': -8, 'type': 'public-key' },
];

const RP = { 'name': 'GOV.UK One Login', id: 'localhost' };

router.post('/start-passkey-registration', async (req, res) => {
    const subjectID = randomBytes(32);
    const challenge = randomBytes(16);
    req.session.passkeyHandle = subjectID;
    req.session.passkeyChallenge = challenge;

    res.json(
        {
            'publicKey': {
                authenticatorSelection: { userVerification: 'required' },
                'challenge': challenge,
                'pubKeyCredParams': CRED_PARAMS,
                'rp': RP,
                timeout: 60000,
                'user': {
                    id: subjectID,
                    'displayName': req.session.data['email'],
                    'name': req.session.data['email']
                }
            }
        }
    );
});
router.post('/complete-passkey-registration', async (req, res) => {
    // in a real version we would need to store the credential somewhere here
    console.log(req.body);
    res.render('foo');
});
router.post('/start-passkey-signin', async (req, res) => {
    const challenge = randomBytes(16);
    req.session.passkeyChallenge = challenge;

    res.json(
        {
            'publicKey': {
                'challenge': challenge,
                'pubKeyCredParams': CRED_PARAMS,
                'rp': RP,
                userVerification: 'required',
                timeout: 60000
            }
        }
    );
});
